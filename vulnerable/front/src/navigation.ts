import { NavigateFunction } from "react-router-dom";

let navigate: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

export const goToLogin = () => {
  if (navigate) {
    navigate("/auth/login");
  } else {
    window.location.href = "/auth/login";
  }
};
