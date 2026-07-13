import { showToast } from "@/shared/lib/show-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { useAddSubTaskMutation } from "../services/tasksApi";
import type { ITask } from "../types";
import SubTaskItem from "./SubTaskItem";

interface Props {
  task: ITask;
}

const SubTask = ({ task }: Props) => {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [addSubtask] = useAddSubTaskMutation();

  const isOptimisticTask = !isNaN(Number(task._id));

  const handleAddSubTask = async () => {
    if (isOptimisticTask) return;
    if (!newSubTaskTitle.trim()) {
      showToast("error", "عنوان ساب‌تسک نمی‌تواند خالی باشد");
      return;
    }
    try {
      await addSubtask({ id: task._id, body: { title: newSubTaskTitle } }).unwrap();
      setNewSubTaskTitle("");
      showToast("success", "ساب‌تسک با موفقیت اضافه شد");
    } catch (err) {
      showToast("error", "خطایی در اضافه کردن ساب‌تسک رخ داده است");
    }
  };

  return (
    <div className="mt-3 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <Accordion
        type="single"
        collapsible
        value={isOptimisticTask ? "" : undefined}
        className="w-full"
      >
        <AccordionItem
          value="subtasks"
          className={`border-none ${isOptimisticTask ? "pointer-events-none opacity-60" : ""}`}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm font-semibold text-foreground/80 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-2">
              <span>ساب تسک‌ها ({task.subTasks?.length || 0})</span>
              {isOptimisticTask && (
                <span className="text-xs font-normal text-muted-foreground animate-pulse flex items-center gap-1">
                  (در حال همگام‌سازی...)
                </span>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex items-center gap-2 p-3 border-t border-border/40 bg-card/50">
            <Input
              placeholder="عنوان ساب تسک جدید..."
              value={newSubTaskTitle}
              onChange={(e) => setNewSubTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
            />
            <Button onClick={handleAddSubTask} className="h-9 px-4">
              افزودن+
            </Button>
          </AccordionContent>

          <div>
            {task.subTasks && task.subTasks.length > 0 ? (
              task.subTasks.map((sub) => (
                <SubTaskItem key={sub._id} sub={sub as ITask} taskId={task._id} />
              ))
            ) : (
              <AccordionContent className="p-4 text-center text-xs text-gray-400">
                هیچ ساب‌تسک برای این تسک ثبت نشده است.
              </AccordionContent>
            )}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SubTask;
