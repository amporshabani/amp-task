import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import LoadingButton from "@/shared/components/LoadingButton";
import { useSendOtpMutation } from "../services/auth.service";
import { updateField } from "../slices/authForm.slice";
import { formatSeconds } from "../utils/format-seconds";
import { showToast } from "@/shared/lib/show-toast";

const ResendOtp = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.authForm.email);
  const otpDeadline = useAppSelector((state) => state.authForm.otpDeadline);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  useEffect(() => {
    const calculate = () => {
      const remaining = Math.max(0, Math.floor((otpDeadline - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [otpDeadline]);

  const handleResend = async () => {
    if (timeLeft === 0) {
      try {
        await sendOtp({ email }).unwrap();
        const newDeadline = Date.now() + 120 * 1000;
        dispatch(updateField({ otpDeadline: newDeadline }));
        showToast("success", "کد تایید ارسال شد");
      } catch (error) {
        showToast("error", "خطایی رخ داده است");
      }
    }
  };

  return (
    <div className="text-center flex items-center justify-center">
      {timeLeft > 0 ? (
        <p className="text-xs text-muted-foreground">
          ارسال مجدد کد در:{" "}
          <span className="text-primary font-bold">{formatSeconds(timeLeft)}</span>
        </p>
      ) : (
        <LoadingButton loading={isLoading} variant="link" size="sm" onClick={handleResend}>
          ارسال مجدد کد تایید
        </LoadingButton>
      )}
    </div>
  );
};

export default ResendOtp;
