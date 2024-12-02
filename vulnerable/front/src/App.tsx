import { useEffect } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import Notification from "./components/common/notification.component";
import { setNavigate } from "./navigation";
import { useAppSelector } from "./store/hooks";
import { RootState } from "./store/store";
import "./style/reset-style.css";

function App() {
  const childStyle = {
    display: "flex",
    gap: 10,
    padding: "10px 0",
  };

  const user = useAppSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  console.log(JSON.stringify(user));

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  if (!user || !user.token) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <>
      <nav style={{ display: "flex", justifyContent: "space-around" }}>
        <ul style={childStyle}>
          <li>
            <Link to={""}>Mangas</Link>
          </li>
          <li>
            <Link to={"categories"}>Catégories</Link>
          </li>
        </ul>
        <div style={childStyle}>
          <button>
            <Link to={"auth/profile"}>Profil</Link>
          </button>
          <button>
            <Link to={"auth/login"}>Se déconnecter</Link>
          </button>
        </div>
      </nav>

      <Notification />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
