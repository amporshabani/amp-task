import { createApi } from "@reduxjs/toolkit/query/react";
import type { ITask } from "../types";
import { baseQueryWithReauth } from "@/app/baseQuery";

interface ITaskResponse {
  data: ITask[];
  currentPage: number;
  totalPages: number;
  total: number;
}

interface QueryState {
  endpointName: string;
  status: "pending" | "fulfilled" | "rejected";
  originalArgs?: any;
  [key: string]: any;
}

const getQueriesTaskApi = (getState: any) => {
  const state = getState();
  const queries: Record<string, QueryState> = state.tasksApi?.queries || {};
  const successfulQueries = Object.values(queries).filter(
    (q) => q.endpointName === "getTasks" && q.status === "fulfilled",
  );
  return successfulQueries.map((q) => q.originalArgs);
};

type QueryArg = { search: string; status: string } | undefined;

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.infiniteQuery<ITaskResponse, QueryArg, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          if (lastPage.currentPage >= lastPage.totalPages) return undefined;
          return lastPage.currentPage + 1;
        },
      },
      query({ pageParam, queryArg }) {
        const searchStr = queryArg?.search ? `&search=${queryArg.search}` : "";
        const statusStr = queryArg?.status ? `&status=${queryArg.status}` : "";
        return `/tasks?page=${pageParam}&limit=10${searchStr}${statusStr}`;
      },
    }),

    createTask: builder.mutation({
      query: (body) => ({ url: "tasks/create", method: "POST", body }),
      async onQueryStarted(body, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              if (arg?.status === "completed") return;
              const tempTask = {
                _id: Date.now().toString(),
                isCompleted: false,
                createdAt: new Date().toISOString(),
                ...body,
              } as ITask;
              if (draft.pages.length > 0) draft.pages[0].data.unshift(tempTask);
            }),
          ),
        );
        try {
          const { data: actualTask } = await queryFulfilled;
          allArgs.map((arg) =>
            dispatch(
              tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
                if (draft.pages.length > 0 && arg?.status !== "completed") {
                  draft.pages[0].data[0] = actualTask;
                }
              }),
            ),
          );
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: ["Task"],
    }),

    toggleIsCompleted: builder.mutation({
      query: ({ id, isCompleted }) => ({
        url: `tasks/iscompleted/${id}`,
        method: "PATCH",
        body: { isCompleted },
      }),
      async onQueryStarted({ id, isCompleted }, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        let taskToMove: any = null;

        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              for (const page of draft.pages) {
                const index = page.data.findIndex((t: any) => t._id === id);

                if (index !== -1) {
                  if (!taskToMove) {
                    taskToMove = JSON.parse(JSON.stringify(page.data[index]));
                    taskToMove.isCompleted = isCompleted;
                  }

                  const statusFilter = arg?.status;

                  if (
                    (statusFilter === "pending" && isCompleted) ||
                    (statusFilter === "completed" && !isCompleted)
                  ) {
                    page.data.splice(index, 1);
                  } else {
                    page.data[index].isCompleted = isCompleted;
                  }
                  return;
                }
              }
              if (taskToMove) {
                const statusFilter = arg?.status;
                const shouldAdd =
                  (statusFilter === "completed" && isCompleted) ||
                  (statusFilter === "pending" && !isCompleted);

                if (shouldAdd) {
                  if (draft.pages.length > 0) {
                    const exists = draft.pages[0].data.some((t: any) => t._id === id);
                    if (!exists) {
                      draft.pages[0].data.unshift(taskToMove);
                    }
                  }
                }
              }
            }),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    editTask: builder.mutation({
      query: ({ id, body }) => ({ url: `tasks/edit/${id}`, method: "PATCH", body }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const task = page.data.find((t) => t._id === id);
                if (task) Object.assign(task, body);
              });
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    deleteTask: builder.mutation({
      query: (id) => ({ url: `tasks/delete/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const index = page.data.findIndex((t) => t._id === id);
                if (index !== -1) page.data.splice(index, 1);
              });
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    addSubTask: builder.mutation({
      query: ({ id, body }) => ({ url: `tasks/create/${id}/subtasks`, method: "POST", body }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const parent = page.data.find((t) => t._id === id);
                if (parent) {
                  if (!parent.subTasks) parent.subTasks = [];
                  parent.subTasks.push({
                    _id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    isCompleted: false,
                    ...body,
                  });
                }
              });
            }),
          ),
        );
        try {
          const { data: updatedTask } = await queryFulfilled;
          allArgs.map((arg) =>
            dispatch(
              tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
                draft.pages.forEach((page) => {
                  const idx = page.data.findIndex((t) => t._id === id);
                  if (idx !== -1) page.data[idx] = updatedTask;
                });
              }),
            ),
          );
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    editSubTask: builder.mutation({
      query: ({ taskId, subTaskId, body }) => ({
        url: `/tasks/${taskId}/subtasks/${subTaskId}`,
        method: "PATCH",
        body,
      }),
      async onQueryStarted({ taskId, subTaskId, body }, { queryFulfilled, dispatch, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const parent = page.data.find((t) => t._id === taskId);
                if (parent?.subTasks) {
                  const target = parent.subTasks.find((s) => s._id === subTaskId);
                  if (target) Object.assign(target, body);
                }
              });
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    deleteSubTask: builder.mutation({
      query: ({ taskId, subTaskId }) => ({
        url: `/tasks/delete/${taskId}/subtasks/${subTaskId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ taskId, subTaskId }, { queryFulfilled, dispatch, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const parent = page.data.find((t) => t._id === taskId);
                if (parent?.subTasks) {
                  const idx = parent.subTasks.findIndex((s) => s._id === subTaskId);
                  if (idx !== -1) parent.subTasks.splice(idx, 1);
                }
              });
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),

    toggleSubtaskIsCompleted: builder.mutation({
      query: ({ taskId, subTaskId, body }) => ({
        url: `/tasks/iscompleted/${taskId}/subtasks/${subTaskId}`,
        method: "PATCH",
        body,
      }),
      async onQueryStarted({ taskId, subTaskId, body }, { dispatch, queryFulfilled, getState }) {
        const allArgs = getQueriesTaskApi(getState);
        const patchResults = allArgs.map((arg) =>
          dispatch(
            tasksApi.util.updateQueryData("getTasks", arg, (draft) => {
              draft.pages.forEach((page) => {
                const parent = page.data.find((t) => t._id === taskId);
                if (parent?.subTasks) {
                  const target = parent.subTasks.find((s) => s._id === subTaskId);
                  if (target) target.isCompleted = body.isCompleted;
                }
              });
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksInfiniteQuery,
  useToggleIsCompletedMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useAddSubTaskMutation,
  useEditSubTaskMutation,
  useDeleteSubTaskMutation,
  useToggleSubtaskIsCompletedMutation,
} = tasksApi;
