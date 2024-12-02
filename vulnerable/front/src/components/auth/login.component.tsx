import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetProfileQuery,
  useLoginUserMutation,
} from "../../store/auth-api";
import { useAppDispatch } from "../../store/hooks";
import { openSnackBar } from "../../store/notification-slice";
import { setUser } from "../../store/user-slice";
import Notification from "../common/notification.component";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [loginUser] = useLoginUserMutation();
  const [trigger, { data: profileData, error: profileError }] =
    useLazyGetProfileQuery();

  useEffect(() => {
    if (profileData) {
      dispatch(setUser({ token, ...profileData }));
      navigate("/");
    }

    if (profileError) {
      dispatch(
        openSnackBar({
          message: "Impossible de récupérer le profile de l'utilisateur",
          severity: "error",
        })
      );
    }
  }, [profileData, profileError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data: loginData, error: loginError } = await loginUser({
      email,
      password,
    });

    if (loginError) {
      dispatch(
        openSnackBar({
          message: "Utilisateur ou mot de passe incorrect",
          severity: "error",
        })
      );
    } else if (loginData) {
      setToken(loginData.access_token);
      trigger(loginData.access_token);
    }
  };

  return (
    <>
      <Notification />
      <h1>Login</h1>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
    </>
  );
};

export default Login;
