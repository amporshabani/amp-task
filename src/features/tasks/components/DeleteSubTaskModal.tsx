import { useAppDispatch, useAppSelector } from "@/app/hook";
import LoadingButton from "@/shared/components/LoadingButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/lib/show-toast";
import { onClose } from "@/app/slices/modal.slice";
import { useDeleteSubTaskMutation } from "../services/tasksApi";

const DeleteSubTaskModal = () => {
  const [deleteSubTask, { isLoading: isDeleteSubTaskLoading }] = useDeleteSubTaskMutation();

  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteSubTask({
        taskId: modal.payload.taskId,
        subTaskId: modal.payload.subtaskId,
      }).unwrap();
      showToast("success", "ساب تسک با موفقیت حذف شد");

      dispatch(onClose());
    } catch (err) {
      showToast("error", "خطایی در حذف ساب تسک رخ داده است");
    }
  };

  return (
    <AlertDialog
      open={modal.isOpen}
      onOpenChange={isDeleteSubTaskLoading ? () => {} : () => dispatch(onClose())}
    >
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            آیا از حذف ساب تسک مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات قابل بازگشت نیست. با این کار ساب تسک شما برای همیشه از سرورهای ما پاک خواهد
            شد.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            disabled={isDeleteSubTaskLoading}
            variant="outline"
            onClick={() => dispatch(onClose())}
          >
            انصراف
          </Button>

          <LoadingButton
            loading={isDeleteSubTaskLoading}
            onClick={handleDelete}
            variant="destructive"
          >
            حذف
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSubTaskModal;
