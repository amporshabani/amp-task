import { Link } from "react-router";
import { useAppSelector } from "@/app/hook";
import Logo from "@/shared/components/Logo";
import { Button } from "@/shared/ui/button";
import { User, ArrowRight } from "lucide-react"; 
import { UpdateEmailCard } from "@/features/profile";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
 
      <div className="w-full max-w-md overflow-hidden border rounded-2xl bg-card shadow-2xl animate-in fade-in duration-300">
        
   
        <div className="p-6 pb-4 bg-muted/30 border-b text-right relative">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" asChild>
            <Link to="/">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex justify-center mb-4">
            <Logo width="130px" />
          </div>
          <h1 className="text-center font-bold text-lg mb-4">تنظیمات حساب کاربری</h1>
          
          <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
              <User size={22} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">ایمیل فعلی</p>
              <h3 className="font-bold text-sm truncate font-mono">{user?.email || "کاربر مهمان"}</h3>
            </div>
          </div>
        </div>

   
        <UpdateEmailCard />

      </div>
    </div>
  );
};

export default ProfilePage;