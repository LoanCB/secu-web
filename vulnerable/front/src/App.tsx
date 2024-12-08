import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Logo from "@src/assets/logo.png";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { RootState } from "@src/store/store";
import { removeUser } from "@src/store/user-slice";
import { User } from "@src/types/user/user";
import { MouseEvent, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Notification from "./components/common/notification.component";
import { RoleType } from "./types/user/role";

const SecureLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const user: User | null = useAppSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(removeUser());
    navigate("/auth/login");
  };
  const pages = [
    {
      text: "Liste des tickets",
      handleClick: () => navigate("/tickets"),
    },
    {
      text: "liste des fichiers",
      handleClick: () => navigate("/files"),
    },
    {
      text: "Liste des utilisateurs",
      handleClick: () => navigate("/users"),
      isAdmin: true,
    },
  ];
  const settings = [
    {
      text: "Se déconnecter",
      handleClick: handleLogout,
    },
  ];

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!user || !user.token) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component="img"
              src={Logo}
              sx={{ width: "50px", height: "auto" }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={page.handleClick}
                    sx={{
                      display: page.isAdmin
                        ? user.role.name === RoleType.ADMINISTRATOR
                          ? "initial"
                          : "none"
                        : "initial",
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {page.text}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={index}
                  onClick={page.handleClick}
                  sx={{
                    my: 2,
                    color: "white",
                    display: page.isAdmin
                      ? user.role.name === RoleType.ADMINISTRATOR
                        ? "block"
                        : "none"
                      : "block",
                  }}
                >
                  {page.text}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    {user!.firstName[0].toUpperCase() +
                      user!.lastName[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={setting.handleClick}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.text}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Notification />
      <Outlet />
    </>
  );
};

export default SecureLayout;
