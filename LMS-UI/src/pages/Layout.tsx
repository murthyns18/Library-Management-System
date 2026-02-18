import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import * as MuiIcons from "@mui/icons-material";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import { setAuthToken } from "../utils/setAuthToken";

const drawerWidth = 220;
const collapsedWidth = 70;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState("Guest");
  const [menus, setMenus] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setAuthToken(token);
    }

    const storedUser = localStorage.getItem("user");
    const storedMenu = localStorage.getItem("menu");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.userName || user.UserName || "Guest");
    }

    if (storedMenu) {
      setMenus(JSON.parse(storedMenu));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      
      <Box
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          transition: "width 0.3s ease",
          bgcolor: "#212529",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
      
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MenuBookIcon />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  LMS
                </Typography>
              </Box>

            
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={() => setCollapsed(true)}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}

          {collapsed && <MenuBookIcon />}
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      
        <List sx={{ flexGrow: 1 }}>
          {menus
            .filter((m) => m.isRead)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((menu) => {
              const path =
                "/dashboard" + menu.menuURL.replace("~", "").toLowerCase();

              const IconComponent =
                MuiIcons[menu.icon as keyof typeof MuiIcons] ||
                MuiIcons.HelpOutline;

              const isActive = location.pathname === path;

              return (
                <Tooltip
                  key={menu.menuID}
                  title={collapsed ? menu.displayName : ""}
                  placement="right"
                >
                  <ListItemButton
                    onClick={() => navigate(path)}
                    sx={{
                      color: "white",
                      justifyContent: collapsed ? "center" : "flex-start",
                      px: collapsed ? 1 : 2,
                      bgcolor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        minWidth: collapsed ? 0 : 35,
                        justifyContent: "center",
                      }}
                    >
                      <IconComponent fontSize="small" />
                    </ListItemIcon>

                    {!collapsed && (
                      <ListItemText primary={menu.displayName} />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

    
        <Box sx={{ p: 2, textAlign: "center" }}>
          {collapsed ? (
            <Tooltip title="Logout" placement="right">
              <IconButton color="error" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
    
      <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5" }}>

        <AppBar position="static" sx={{ bgcolor: "#212529" }}>
          <Toolbar>
          
            {collapsed && (
              <IconButton
                color="inherit"
                onClick={() => setCollapsed(false)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Library Management System
            </Typography>

            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <AccountCircleIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>
                Signed in as <strong>{userName}</strong>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
       
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "#f0ddcd",
          }}
        >
          © 2026 - LMS
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
