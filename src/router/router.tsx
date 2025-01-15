import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/Pages/ErrorPage";
import { Root } from "../Root";
import { DefaultLayout } from "../layout/DefaultLayout";
import { AuthLayout } from "../layout/AuthLayout";
import SignIn from "../pages/Authentication/SignIn";
import ResetPassword from "../pages/Authentication/ResetPassword";
import { DataLogs } from "../pages/Pages/DataLogs";
import { DataDashboard } from "../pages/Pages/DataDashboard";
import { DataUsers } from "../pages/Pages/DataUsers";
import { DataParams } from "../pages/Pages/DataParams";
import { DataProfile } from "../pages/Pages/DataProfile";
import { DataRoles } from "../pages/Pages/DataRoles";
import { DMLLogs } from "../pages/Pages/DMLLogs";
import { Entities } from "../pages/Pages/Entities";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      //DefaultLayout Routes
      {
        path: "home",
        element: <DefaultLayout />,
        children: [
          {
            path: '',
            element: <DataDashboard />,
          },
          {
            path: "logs-db",
            element: <DataLogs />,
          },
          {
            path: "entities",
            element: <Entities />,
          },
          {
            path: "logs-dml",
            element: <DMLLogs />,
          },
          {
            path: "users",
            element: <DataUsers />,
          },
          {
            path: "params",
            element: <DataParams />,
          },
          {
            path: "profiles",
            element: <DataProfile />,
          },
          {
            path: "roles",
            element: <DataRoles />,
          }
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "signin",
            element: <SignIn />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
]);
