import { AccordionContent } from "@/shared/ui/accordion";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { showToast } from "@/shared/lib/show-toast";
import { Check, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { useEditSubTaskMutation, useToggleSubtaskIsCompletedMutation } from "../services/tasksApi";
import type { ITask } from "../types";
import { useAppDispatch } from "@/app/hook";
import { onOpen } from "@/app/slices/modal.slice";
import { Button } from "@/shared/ui/button";

interface Props {
  sub: ITask;
  taskId: string;
}

const SubTaskItem = ({ sub, taskId }: Props) => {
  const dispatch = useAppDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(sub.title);

  const [editSubTask, { isLoading: isLoadingEditSubTask }] = useEditSubTaskMutation();
  const [toggleSubTaskIsCompleted, { isLoading: isLoadingToggleSubTaskIsCompleted }] =
    useToggleSubtaskIsCompletedMutation();

  const handleUpdate = async () => {
    if (isLoadingEditSubTask) return;
    try {
      editSubTask({ taskId, subTaskId: sub._id, body: { title: editTitle } }).unwrap();
      setIsEdit(false);
      showToast("success", "ساب‌تسک با موفقیت ویرایش شد");
    } catch (err) {
      showToast("error", "خطایی رخ داد");
    }
  };

  const handleToggleSubTaskIsCompleted = async () => {
    try {
      await toggleSubTaskIsCompleted({
        taskId,
        subTaskId: sub._id,
        body: { isCompleted: !sub.isCompleted },
      }).unwrap();
    } catch (err) {
      console.error("خطا در آپدیت تسک:", err);
    }
  };

  return (
    <AccordionContent className="flex items-center  gap-1 pr-6 pl-3 text-sm border-b last:border-none">
      <div className="flex items-center gap-4 justify-between w-full p-2 border-r-4 border-primary/40  rounded-l-md bg-background mt-2">
        <Checkbox
          checked={!!sub.isCompleted}
          onCheckedChange={handleToggleSubTaskIsCompleted}
          disabled={isLoadingToggleSubTaskIsCompleted}
          className={`${isLoadingToggleSubTaskIsCompleted ? "disabled:cursor-wait" : ""} border-primary`}
        />

        <div className="flex flex-col gap-0.5 flex-1 ml-2">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 text-xs focus-visible:ring-1"
                autoFocus
              />
            </div>
          ) : (
            <span className={`font-medium ${sub.isCompleted ? "line-through text-gray-400" : ""}`}>
              {sub.title}
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {new Date(sub.createdAt).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex gap-3">
          {isEdit ? (
            <>
              <Check
                size={16}
                onClick={handleUpdate}
                className="text-green-600  hover:scale-110 transition-transform"
              />
              <X
                size={16}
                onClick={() => {
                  setIsEdit(false);
                  setEditTitle(sub.title);
                }}
                className="text-destructive  hover:scale-110 transition-transform"
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant={"ghost"} onClick={() => setIsEdit(true)}>
                <Pencil className="w-5 h-5" />
              </Button>
              <Button
                variant={"ghost"}
                onClick={() =>
                  dispatch(
                    onOpen({ view: "DELETE_SUBTASK", payload: { taskId, subtaskId: sub._id } }),
                  )
                }
              >
                <Trash className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </AccordionContent>
  );
};

export default SubTaskItem;
