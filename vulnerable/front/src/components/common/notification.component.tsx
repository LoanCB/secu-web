import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeSnackBar } from "../../store/notification-slice";
import { RootState } from "../../store/store";

const getColor = (severity: "error" | "success" | "warning" | "info") => {
  switch (severity) {
    case "error":
      return "#ef5350";
    case "info":
      return "#03a9f4";
    case "success":
      return "#4caf50";
    case "warning":
      return "#ff9800";
  }
};

const Notification = () => {
  const dispatch = useAppDispatch();

  const notificationState = useAppSelector(
    (state: RootState) => state.notification
  );
  const { isActiveSnackBar, message, severity } = notificationState;

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackBar());
  };

  if (!notificationState) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: isActiveSnackBar ? "block" : "none",
        backgroundColor: getColor(severity),
        padding: "10px",
      }}
    >
      {message}
      <button
        style={{
          color: "white",
          border: "solid 1px white",
          borderRadius: "5px",
          padding: "5px",
          marginLeft: "5px",
        }}
        onClick={handleClose}
      >
        Fermer
      </button>
    </div>
  );
};

export default Notification;
