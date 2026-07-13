import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAppSelector } from "@/app/hook";
import { Pencil, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Logo from "@/shared/components/Logo";
import { VerifyForm } from "@/features/auth/components/VerifyForm";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { email } = useAppSelector((state) => state.authForm);

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 p-6 border rounded-lg bg-card shadow-sm animate-in slide-in-from-left-4 duration-300">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/login">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Logo width="100px" />
          <div className="w-9" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">تأیید کد ۶ رقمی</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm font-mono">{email}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link to="/login">
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        <VerifyForm />
      </div>
    </div>
  );
};

export default VerifyPage;
