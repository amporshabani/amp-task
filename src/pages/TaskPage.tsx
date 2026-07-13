import { AddTask, TaskList } from "@/features/tasks";

const TasksPage = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">مدیریت تسک‌ها</h1>
            <p className="text-sm text-muted-foreground mt-1">
              کارهای روزمره خود را یادداشت و مدیریت کنید.
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <AddTask />
        </div>

        <div className="space-y-4">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
