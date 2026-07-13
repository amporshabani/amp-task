import { useAppDispatch } from "@/app/hook";
import { onOpen } from "@/app/slices/modal.slice";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Check, Pencil, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useEditTaskMutation, useToggleIsCompletedMutation } from "../services/tasksApi";
import type { ITask } from "../types";
import SubTask from "./SubTask";

interface Props {
  task: ITask;
}

const Task = ({ task }: Props) => {
  const [isEdit, setIsEdit] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const [toggleIsCompleted, { isLoading: isToggleLoading }] = useToggleIsCompletedMutation();
  const [editTask, { isLoading: isEditLoading }] = useEditTaskMutation();

  const dispatch = useAppDispatch();

  const handleToggleIsCompleted = async () => {
    try {
      await toggleIsCompleted({
        id: task._id,
        isCompleted: !task.isCompleted,
      }).unwrap();
    } catch (err) {
      console.error("خطا در آپدیت تسک:", err);
    }
  };

  const handleEdit = async () => {
    if (isEditLoading) return;
    try {
      await editTask({
        id: task._id,
        body: {
          title,
          description,
        },
      }).unwrap();
      setIsEdit(false);
    } catch (err) {
      console.error("خطا در آپدیت تسک:", err);
    }
  };

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [isEdit]);

  return (
    <div
      className={`${
        task.isCompleted ? "line-through opacity-60" : ""
      } w-full border-2 rounded p-3 flex flex-col my-1 transition-all`}
    >
      <div className="flex items-center gap-6 justify-between w-full">
        <div className="flex flex-col gap-0.5 flex-1">
          <span>{new Date(task.createdAt).toLocaleDateString("fa-IR")}</span>
          {isEdit ? (
            <>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-10"
              />
            </>
          ) : (
            <>
              <span className="text-lg font-medium"> {task.title}</span>
              <span className="text-sm text-gray-500"> {task.description}</span>
            </>
          )}
          <span>
            {new Date(task.createdAt).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isEdit && (
            <Button
              variant={"ghost"}
              onClick={() =>
                dispatch(onOpen({ view: "DELETE_TASK", payload: { taskId: task._id } }))
              }
            >
              <Trash className="text-destructive w-5 h-5" />
            </Button>
          )}
          {isEdit ? (
            <div className="flex items-center gap-3">
              <Check size={18} onClick={handleEdit} className="text-green-500 border rounded" />
              <X
                size={18}
                onClick={() => setIsEdit(false)}
                className="text-destructive border rounded"
              />
            </div>
          ) : (
            <Button variant={"ghost"} onClick={() => setIsEdit(true)}>
              <Pencil size={18} />
            </Button>
          )}
        </div>
        <Checkbox
          disabled={isToggleLoading}
          checked={task.isCompleted}
          onCheckedChange={handleToggleIsCompleted}
          className={`${isToggleLoading ? "disabled:cursor-wait" : ""} border-primary`}
        />
      </div>

      <SubTask task={task} />
    </div>
  );
};

export default Task;
