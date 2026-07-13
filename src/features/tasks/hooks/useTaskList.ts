import { useEffect, useRef, useState } from "react";
import { useGetTasksInfiniteQuery } from "../services/tasksApi";

export const useTaskList = () => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { tasks, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useGetTasksInfiniteQuery(
      { search: debouncedSearch, status: status === "all" ? "" : status },
      {
        selectFromResult: ({ data, ...rest }) => ({
          ...rest,
          tasks: data?.pages.flatMap((page) => page.data) ?? [],
        }),
      },
    );

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    tasks,
    status,
    setStatus,
    setDebouncedSearch,
    isLoading,
    isFetching,
    isFetchingNextPage,
    debouncedSearch,
    observerTarget,
  };
};
