import Logo from "@/shared/components/Logo";
import { IdentificationForm } from "@/features/auth/components/IdentificationForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-6 border rounded-lg bg-card shadow-sm animate-in fade-in duration-300">
        <div className="flex flex-col items-center space-y-4 text-center mb-6">
          <Logo width="150px" />
          <h1 className="text-xl font-bold">ورود / ثبت‌نام</h1>
          <p className="text-sm text-muted-foreground">برای ادامه، ایمیل خود را وارد کنید</p>
        </div>

        <IdentificationForm />
      </div>
    </div>
  );
};

export default LoginPage;
