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
import { useDeleteTaskMutation } from "../services/tasksApi";
import { onClose } from "@/app/slices/modal.slice";

const DeleteTaskModal = () => {
  const [deleteTask, { isLoading: isDeleteLoading }] = useDeleteTaskMutation();

  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await deleteTask(modal.payload.taskId).unwrap();
      showToast("success", "تسک با موفقیت حذف شد");

      dispatch(onClose());
    } catch (err) {
      showToast("error", "خطایی در حذف تسک رخ داده است");
    }
  };

  return (
    <AlertDialog
      open={modal.isOpen}
      onOpenChange={isDeleteLoading ? () => {} : () => dispatch(onClose())}
    >
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">آیا از حذف تسک مطمئن هستید؟</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات قابل بازگشت نیست. با این کار تسک شما برای همیشه از سرورهای ما پاک خواهد شد.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button disabled={isDeleteLoading} variant="outline" onClick={() => dispatch(onClose())}>
            انصراف
          </Button>

          <LoadingButton loading={isDeleteLoading} onClick={handleDelete} variant="destructive">
            حذف
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;
