import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";








const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <div>404 n0t found</div>,
    children: [

    ]
  }
]);

export default router;