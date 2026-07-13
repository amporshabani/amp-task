import LoadingButton from "@/shared/components/LoadingButton";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { Label } from "@/shared/ui/label";
import { ShieldCheck } from "lucide-react";

interface OtpVerifyFormProps {
  otp: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const OtpVerifyForm = ({ otp, onChange, onSubmit, isLoading }: OtpVerifyFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in zoom-in-95 duration-300">
      <div className="p-5 rounded-xl bg-secondary/30 border border-dashed border-border flex flex-col items-center gap-4">
        <Label className="text-xs font-bold text-primary flex items-center gap-2">
          <ShieldCheck size={16} /> کد تایید ارسال شده را وارد کنید
        </Label>
        <div dir="ltr">
          <InputOTP maxLength={6} value={otp} onChange={onChange}>
            <InputOTPGroup className="gap-2">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-11 w-10 border-2 rounded-lg bg-background font-bold shadow-sm"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <LoadingButton
        type="submit"
        className="w-full h-11 font-bold rounded-xl bg-primary text-primary-foreground"
        disabled={otp.length < 6 || isLoading}
        loading={isLoading}
      >
        تایید و ثبت نهایی
      </LoadingButton>
    </form>
  );
};
