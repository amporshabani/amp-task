import { useAppDispatch } from "@/app/hook";
import { logout as authLogout } from "@/features/auth/slices/auth.slice";
import { tasksApi } from "@/features/tasks/services/tasksApi";
import { authApi } from "@/features/auth/services/auth.service"; 

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(authLogout());

    dispatch(tasksApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
  };

  return handleLogout;
};
