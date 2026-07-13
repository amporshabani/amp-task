import { useAppSelector } from "@/app/hook";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Spinner } from "@/shared/ui/spinner";
import { ListFilter } from "lucide-react";
import { useTaskList } from "../hooks/useTaskList";
import DeleteSubTaskModal from "./DeleteSubTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import SearchInput from "./SearchInput";
import Task from "./Task";
import TaskEmptyState from "./TaskEmpty";

const TaskList = () => {
  const modal = useAppSelector((state) => state.modal);

  const {
    tasks,
    status,
    setStatus,
    setDebouncedSearch,
    isLoading,
    isFetching,
    isFetchingNextPage,
    debouncedSearch,
    observerTarget,
  } = useTaskList();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <ListFilter className="h-4 w-4 shrink-0" />
          <span>فیلتر و وضعیت تسک‌ها</span>
          {isFetching && <Spinner className="h-4 w-4 mr-2" />}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput onSearchChange={setDebouncedSearch} />
          </div>

          <Select value={status} onValueChange={setStatus} dir="rtl">
            <SelectTrigger className="w-full sm:w-40 bg-background">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">همه تسک‌ها</SelectItem>
              <SelectItem value="completed">انجام شده</SelectItem>
              <SelectItem value="pending">در حال انجام</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea
        className="h-120 sm:h-160 w-full rounded-xl border bg-card p-4 sm:p-5 shadow-sm"
        dir="rtl"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 space-y-3 text-muted-foreground">
            <Spinner className="h-8 w-8" />
            <p className="text-sm">در حال دریافت لیست تسک‌ها...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Task key={task.createdAt} task={task} />
            ))}

            <div ref={observerTarget} className="h-12 flex items-center justify-center pt-2">
              {isFetchingNextPage && <Spinner className="h-6 w-6" />}
            </div>
          </div>
        ) : (
          <TaskEmptyState isSearching={!!debouncedSearch} />
        )}
      </ScrollArea>

      {modal.view === "DELETE_TASK" && <DeleteTaskModal />}
      {modal.view === "DELETE_SUBTASK" && <DeleteSubTaskModal />}
    </div>
  );
};

export default TaskList;
