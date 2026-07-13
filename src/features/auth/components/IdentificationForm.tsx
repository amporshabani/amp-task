import { useAppDispatch, useAppSelector } from "@/app/hook";
import LoadingButton from "@/shared/components/LoadingButton";
import { showToast } from "@/shared/lib/show-toast";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSendOtpMutation } from "../services/auth.service";
import { updateField } from "../slices/authForm.slice";
import { validateIdentificationForm } from "../utils/identification-validation";
import FormField from "./FormField";

export const IdentificationForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.authForm.email);
  const lastSentEmail = useAppSelector((state) => state.authForm.lastSentEmail);
  const [errors, setErrors] = useState({ email: "" });
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: valErrors, isValid } = validateIdentificationForm({ email });
    setErrors(valErrors);

    if (isValid) {
      if (email === lastSentEmail) {
        navigate("/verify");
        return;
      }

      try {
        await sendOtp({ email }).unwrap();
        showToast("success", "کد تایید ارسال شد");

        const newDeadline = Date.now() + 120 * 1000;
        dispatch(updateField({ lastSentEmail: email, otpDeadline: newDeadline }));
        navigate("/verify");
      } catch {
        showToast("error", "خطا در برقراری ارتباط با سرور");
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          type="email"
          placeholder="example@mail.com"
          value={email}
          error={errors.email}
          onChange={(val) => dispatch(updateField({ email: val }))}
          dir="ltr"
          label="ایمیل"
        />
        <div className="flex gap-3">
          <LoadingButton loading={isLoading} type="submit" className="flex-2 w-full">
            بعدی
          </LoadingButton>
          <Button variant="outline" className="flex-1" asChild>
            <Link to="/">لغو</Link>
          </Button>
        </div>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="grow border-t border-muted"></div>
        <span className="shrink mx-4 text-xs text-muted-foreground">یا</span>
        <div className="grow border-t border-muted"></div>
      </div>

      <Link to="/">
        <Button variant="secondary" className="w-full">
          برگشت به صفحه اصلی
        </Button>
      </Link>
    </div>
  );
};
