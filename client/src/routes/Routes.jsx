import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "@/pages/Login/Login";
import SignUp from "@/pages/SignUp/SignUp";
import Dashboard from "@/pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";









const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 n0t found</div>,
    children: [
      {
        path: '/',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signUp',
    element: <SignUp />
  }
]);

export default router;