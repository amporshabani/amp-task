import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Link, useNavigate } from "react-router";
import { Button } from "../../ui/button";
import { setTheme } from "@/app/slices/theme.slice";
import { useLogoutMutation } from "@/features/auth/services/auth.service";
import { logout as authLogoutAction } from "@/features/auth/slices/auth.slice";
import { tasksApi } from "@/features/tasks/services/tasksApi";
import { LogIn, Moon, Sun, User, UserCheck } from "lucide-react";
import LoadingButton from "../LoadingButton";
import Logo from "../Logo";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const mood = useAppSelector((state) => state.theme.mood);

  const [logoutApi, { isLoading: isLoadingLogout }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await logoutApi(undefined).unwrap();
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(authLogoutAction());
      dispatch(tasksApi.util.resetApiState());
      navigate("/");
    }
  };
  return (
    <div className="container mx-auto p-2 flex items-center justify-between">
      <Link to="/">
        <Logo width="80px" />
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch(setTheme(mood === "light" ? "dark" : "light"))}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl">
              <Link to="/profile">
                <UserCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-xs hidden sm:inline">حساب کاربری</span>
              </Link>
            </Button>
            <LoadingButton
              loading={isLoadingLogout}
              onClick={handleLogout}
              variant="ghost"
              size="sm"
            >
              خروج
            </LoadingButton>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl border-dashed border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400"
            >
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">کاربر مهمان</span>
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="gap-1 rounded-xl text-xs font-bold"
            >
              <Link to="/login">
                <LogIn size={14} />
                ورود
              </Link>
            </Button>
          </div>
        )}


        {!isAuthenticated && !isGuest && (
          <Button asChild size="sm" className="rounded-xl animate-in fade-in duration-300">
            <Link to="/login">ورود / ثبت‌نام</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
