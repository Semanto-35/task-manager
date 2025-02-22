import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "@/pages/Login/Login";
import SignUp from "@/pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Home from "@/pages/Home/Home";
import Dashboard from "@/layouts/Dashboard";
import Overview from "@/pages/Dashboard/Overview";
import Tasks from "@/pages/Dashboard/Tasks";
import TaskBoard from "@/pages/Dashboard/TaskBoard";








const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 Not Found</div>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signUp", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      { path: "", element: <Overview /> },
      { path: "tasks", element: <TaskBoard /> },
    ],
  },
]);

export default router;