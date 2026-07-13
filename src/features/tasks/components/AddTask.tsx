import { showToast } from "@/shared/lib/show-toast";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useState } from "react";
import { useCreateTaskMutation } from "../services/tasksApi";

const AddTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const [createTask] = useCreateTaskMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.title.trim()) {
      showToast("error", "عنوان تسک نمی تواند خالی باشد");
      return;
    }

    try {
      await createTask(task).unwrap();

      setTask({
        title: "",
        description: "",
      });
      showToast("success", "تسک با موفقیت اضافه شد");
    } catch (err) {
      showToast("error", "اضافه شدن تسک با مشکل رو به رو شد");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between rounded shadow p-5 gap-1 h-fit"
    >
      <div className="flex flex-col gap-2">
        <Input
          placeholder="کتاب خواندن..."
          onChange={handleChange}
          value={task.title}
          name="title"
        />
        <Textarea
          placeholder="توضیحات..."
          className="resize-none"
          onChange={handleChange}
          value={task.description}
          name="description"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button>افزودن +</Button>
      </div>
    </form>
  );
};

export default AddTask;
