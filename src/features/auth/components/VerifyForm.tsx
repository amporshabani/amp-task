import { useAppDispatch, useAppSelector } from "@/app/hook";
import { setCredentials } from "@/features/auth/slices/auth.slice";
import { tasksApi } from "@/features/tasks/services/tasksApi";
import LoadingButton from "@/shared/components/LoadingButton";
import { showToast } from "@/shared/lib/show-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { useNavigate } from "react-router";
import { useVerifyOtpMutation } from "../services/auth.service";
import { resetForm, updateField } from "../slices/authForm.slice";
import ResendOtp from "./ResendOtp";

export const VerifyForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.authForm.email);
  const otp = useAppSelector((state) => state.authForm.otp);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const guestId = localStorage.getItem("guest_id");

      const response = await verifyOtp({ email, otp, guestId }).unwrap();

      dispatch(setCredentials(response.user));

      dispatch(tasksApi.util.invalidateTags(["Task"]));

      localStorage.removeItem("guest_id");

      navigate("/", { replace: true });

      setTimeout(() => {
        dispatch(resetForm());
      }, 100);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "کد وارد شده صحیح نیست";
      showToast("error", errorMessage);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="flex justify-center" dir="ltr">
        <InputOTP maxLength={6} value={otp} onChange={(val) => dispatch(updateField({ otp: val }))}>
          <InputOTPGroup className="gap-2">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="rounded-md border-2 h-12 w-10 sm:w-12 text-lg font-bold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-3">
        <LoadingButton loading={isLoading} type="submit" className="w-full">
          ورود به سیستم
        </LoadingButton>
        <ResendOtp />
      </div>
    </form>
  );
};
