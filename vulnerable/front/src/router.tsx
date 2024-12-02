import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/auth/login.component";
import UserProfile from "./components/auth/user-profile.component";
import Dashboard from "./components/base/dashboard";
import NotFound from "./components/not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
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
