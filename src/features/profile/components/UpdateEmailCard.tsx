import { useAppSelector } from "@/app/hook";
import { showToast } from "@/shared/lib/show-toast";
import { Button } from "@/shared/ui/button";
import { LogIn, Pencil } from "lucide-react"; 
import { useState } from "react";
import { Link, useNavigate } from "react-router"; 
import {
  useSendOtpChangeEmailMutation,
  useVerifyChangeEmailMutation,
} from "../service/user.service";
import { EmailChangeForm } from "./EmailChangeForm";
import { OtpVerifyForm } from "./OtpVerifyForm";

export const UpdateEmailCard = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [email, setEmail] = useState("");
  const [lastSentEmail, setLastSentEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [sendOtpChangeEmail, { isLoading: isLoadingSendOtp }] = useSendOtpChangeEmailMutation();
  const [verifyOtpChangeEmail, { isLoading: isLoadingVerifyOtp }] = useVerifyChangeEmailMutation();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (email === user?.email) {
      showToast("error", "ایمیل جدید نمی‌تواند با ایمیل فعلی یکی باشد");
      return;
    }

    if (email !== lastSentEmail) {
      try {
        await sendOtpChangeEmail({ email }).unwrap();
        setLastSentEmail(email);
        setIsOtpSent(true);
        showToast("success", "کد تایید به ایمیل جدید ارسال شد");
      } catch (err) {
        showToast("error", "خطا در ارسال کد تایید");
      }
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    try {
      await verifyOtpChangeEmail({ email, otp }).unwrap();
      showToast("success", "ایمیل شما با موفقیت تغییر یافت");
      setIsOtpSent(false);
      setOtp("");
      navigate("/");
    } catch (err) {
      showToast("error", "کد وارد شده صحیح نیست");
      setOtp("");
    }
  };

  if (!user || !user.email) {
    return (
      <div className="p-6 text-center space-y-5 animate-in fade-in duration-300">
       

        <Button
          className="w-full h-11 font-bold rounded-xl bg-primary text-primary-foreground gap-2"
          asChild
        >
          <Link to="/login">
            <LogIn size={16} />
            ورود / ثبت‌نام در سایت
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h2 className="text-sm font-bold">تغییر ایمیل</h2>
        </div>
        {isOtpSent && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsOtpSent(false)}
            className="h-auto p-0 text-xs gap-1 text-primary"
          >
            <Pencil size={12} /> ویرایش ایمیل
          </Button>
        )}
      </div>

      <div>
        {!isOtpSent ? (
          <EmailChangeForm
            email={email}
            onChange={setEmail}
            onSubmit={handleSendOtp}
            isLoading={isLoadingSendOtp}
          />
        ) : (
          <OtpVerifyForm
            otp={otp}
            onChange={setOtp}
            onSubmit={handleVerifyOtp}
            isLoading={isLoadingVerifyOtp}
          />
        )}
      </div>
    </div>
  );
};
