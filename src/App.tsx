import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "./app/hook";
import { setGuestCredentials } from "./features/auth";
import { Footer } from "./shared/components/layout/Footer";
import Header from "./shared/components/layout/Header";
import { useAuth } from "./shared/hooks/useAuth";

function App() {
  const dispatch = useAppDispatch();
  const mood = useAppSelector((state) => state.theme.mood);

  useAuth();

  useEffect(() => {
    const guestId = localStorage.getItem("guest_id");

    if (guestId) {
      dispatch(setGuestCredentials({ guestId }));
    } else {
      const newGuestId = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("guest_id", newGuestId);
      dispatch(setGuestCredentials({ guestId: newGuestId }));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (mood === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mood);
    }
  }, [mood]);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-background">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
