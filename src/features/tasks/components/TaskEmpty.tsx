import { FolderOpen, SearchX } from "lucide-react";

interface Props {
  isSearching: boolean;
}

const TaskEmptyState = ({ isSearching }: Props) => {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <div className="bg-muted p-4 rounded-full max-w-max mx-auto">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">تسکی پیدا نشد</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            موردی با فیلتر انتخاب شده پیدا نشد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
      <div className="bg-muted p-4 rounded-full max-w-max mx-auto">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">هنوز تسکی ایجاد نکردی(:</h3>
      </div>
    </div>
  );
};

export default TaskEmptyState;
