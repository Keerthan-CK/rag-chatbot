"use client";

import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";

import {
  MessageSquare,
  FileText,
  Settings,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const drawerWidth = 240;
const collapsedWidth = 64;

export default function AppSidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: isCollapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isCollapsed ? collapsedWidth : drawerWidth,
          bgcolor: "#071024",
          color: "#fff",
          boxSizing: "border-box",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          minHeight: "64px",
        }}
      >
        <Avatar
          src="/logo.png"
          alt="logo"
          sx={{ width: 60, height: 60, borderRadius: 0 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
        <IconButton
          onClick={toggleCollapse}
          size="small"
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.05)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            borderRadius: 1,
          }}
        >
          {isCollapsed ? (
            <ChevronsRight size={18} />
          ) : (
            <ChevronsLeft size={18} />
          )}
        </IconButton>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1 }}>
        <ListItemButton
          onClick={() => router.push("/chat")}
          sx={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            borderRadius: 2,
            mb: 0.5,
            px: isCollapsed ? 1 : 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? "auto" : 40,
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <MessageSquare size={20} />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Chat" />}
        </ListItemButton>

        {/* Documents */}
        <ListItemButton
          onClick={() =>
            document
              .getElementById("doc-upload")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          sx={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            borderRadius: 2,
            mb: 0.5,
            px: isCollapsed ? 1 : 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? "auto" : 40,
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <FileText size={20} />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Documents" />}
        </ListItemButton>

        {/* Settings */}
        <ListItemButton
          onClick={() => router.push("/settings")}
          sx={{
            justifyContent: isCollapsed ? "center" : "flex-start",
            borderRadius: 2,
            mb: 0.5,
            px: isCollapsed ? 1 : 2,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? "auto" : 40,
              justifyContent: "center",
              color: "inherit",
            }}
          >
            <Settings size={20} />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Settings" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
}
