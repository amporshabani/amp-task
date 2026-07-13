import { toast } from "sonner";

type TShowToast = "success" | "error" | "info" | "warning" | "loading";

export const showToast = (
  type: TShowToast,
  message: string | undefined = "در نمایش پیام خطایی رخ داده است"
) => {
  const toastId = toast[type](message, {
    action: {
      label: "بستن",
      onClick: () => toast.dismiss(toastId),
    },
  });
};
