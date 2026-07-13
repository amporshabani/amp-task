import App from "@/App";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import TasksPage from "@/pages/TaskPage";
import VerifyPage from "@/pages/VerifyPage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <TasksPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center font-bold">
        صفحه مورد نظر یافت نشد.
      </div>
    ),
  },
]);

export default router;
