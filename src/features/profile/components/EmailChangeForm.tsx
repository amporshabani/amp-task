import FormField from "@/features/auth/components/FormField";
import LoadingButton from "@/shared/components/LoadingButton";

interface EmailChangeFormProps {
  email: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const EmailChangeForm = ({ email, onChange, onSubmit, isLoading }: EmailChangeFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-300">
      <FormField
        placeholder="example@mail.com"
        value={email}
        onChange={onChange}
        dir="ltr"
        label="ایمیل جدید"
        type="email"
      />
      <LoadingButton
        type="submit"
        className="w-full h-11 font-bold rounded-xl bg-primary text-primary-foreground"
        disabled={!email || isLoading}
        loading={isLoading}
      >
        ادامه
      </LoadingButton>
    </form>
  );
};
