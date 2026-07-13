import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useGetMeQuery } from "@/features/auth/services/auth.service";
import { setCredentials, setGuestCredentials, setLoading } from "@/features/auth/slices/auth.slice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isGuest } = useAppSelector((state) => state.auth);

  const { data: userData, error, isLoading, isSuccess, isError } = useGetMeQuery(undefined);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }

    if (isSuccess && userData) {
      dispatch(setCredentials(userData));
    }

    if (isError || error) {
      if (!isGuest) {
        const existingGuestId = localStorage.getItem("guest_id") || "guest_session";
        dispatch(setGuestCredentials({ guestId: existingGuestId }));
      } else {
        dispatch(setLoading(false));
      }
    }
  }, [userData, error, isLoading, isSuccess, isError, isGuest, dispatch]);
};
