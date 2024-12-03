import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/login.component";
import UserProfile from "./components/auth/user-profile.component";
import Dashboard from "./components/base/dashboard";
import FilesList from "./components/base/files-list";
import TicketsList from "./components/base/tickets-list";
import UsersList from "./components/base/users-list";
import NotFound from "./components/not-found";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "/users",
        element: <UsersList />,
      },
      {
        path: "/tickets",
        element: <TicketsList />,
      },
      {
        path: "/files",
        element: <FilesList />,
      },
      {
        path: "/auth/profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
]);

export default router;
