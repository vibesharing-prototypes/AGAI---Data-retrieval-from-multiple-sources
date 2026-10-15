import { useState, type MouseEvent } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import FolderIcon from "@diligentcorp/atlas-react-bundle/icons/Folder";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import PinIcon from "@diligentcorp/atlas-react-bundle/icons/Pin";
import TrashIcon from "@diligentcorp/atlas-react-bundle/icons/Trash";

import { type ChatThread } from "../data/hybrid-search.constants.js";

function NewChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.25 13.75H12.75V10.75H15.75V9.25H12.75V6.25H11.25V9.25H8.25V10.75H11.25V13.75ZM2.5 21.0384V2.5H21.5V17.5H6.03845L2.5 21.0384ZM5.4 16H19.6923C19.7692 16 19.8397 15.9679 19.9038 15.9038C19.9679 15.8397 20 15.7692 20 15.6923V4.3077C20 4.23077 19.9679 4.16024 19.9038 4.09613C19.8397 4.03203 19.7692 3.99998 19.6923 3.99998H4.3077C4.23077 3.99998 4.16024 4.03203 4.09613 4.09613C4.03203 4.16024 3.99998 4.23077 3.99998 4.3077V17.3846L5.4 16Z" fill="currentColor"/>
    </svg>
  );
}

type Variant = "overlay" | "sidenav";

interface ChatThreadItemProps {
  thread: ChatThread;
  isActive?: boolean;
  variant: Variant;
  onLoadThread: (thread: ChatThread) => void;
  isPinned?: boolean;
  onPin?: (id: string, currentlyPinned: boolean) => void;
  onNewChat?: () => void;
  onMoveToProject?: (id: string) => void;
}

const TEXT_DEFAULT = "rgb(36,38,40)";

export default function ChatThreadItem({ thread, isActive = false, variant, onLoadThread, isPinned = false, onPin, onNewChat, onMoveToProject }: ChatThreadItemProps) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = (e?: object, reason?: string) => {
    void e; void reason;
    setAnchorEl(null);
  };

  const rowSx =
    variant === "overlay"
      ? {
          borderRadius: "6px",
          backgroundColor: isActive ? "rgba(0,0,0,0.04)" : "transparent",
          opacity: !isActive ? 0.75 : 1,
          fontWeight: isActive ? 600 : 400,
          color: TEXT_DEFAULT,
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", opacity: 1 },
        }
      : {
          color: color.type.default.value,
          "&:hover": { backgroundColor: color.surface.variant.value },
        };

  return (
    <>
      <Tooltip
        title={
          <Box sx={{ p: "2px" }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1a1f27", lineHeight: "18px", mb: "2px" }}>
              {new Date(thread.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 400, color: "#4a4f5a", lineHeight: "18px", maxWidth: "200px", wordBreak: "break-word" }}>
              {thread.title}
            </Typography>
          </Box>
        }
        placement="right"
        arrow
        enterDelay={800}
        disableHoverListener={isMenuOpen}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              px: "12px",
              py: "10px",
              "& .MuiTooltip-arrow": { color: "#fff" },
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            ...rowSx,
            "& .chat-thread-action-btn": {
              opacity: isMenuOpen ? 1 : 0,
              backgroundColor: "transparent",
            },
            "& .chat-thread-more-btn": {
              opacity: isMenuOpen ? 1 : 0,
              backgroundColor: isMenuOpen ? "rgba(0,0,0,0.06)" : "transparent",
            },
            "&:hover .chat-thread-action-btn": { opacity: 1 },
            "&:hover .chat-thread-more-btn": { opacity: 1 },
          }}
        >
          <Box
            component="button"
            onClick={() => onLoadThread(thread)}
            sx={{
              all: "unset",
              cursor: "pointer",
              flex: 1,
              minWidth: 0,
              boxSizing: "border-box",
              px: "12px",
              py: "8px",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: "72px",
              fontWeight: "inherit",
              color: "inherit",
            }}
          >
            {thread.title}
          </Box>
          {onNewChat && (
            <Tooltip title="New chat" placement="top" enterDelay={600}>
              <IconButton
                className="chat-thread-action-btn"
                aria-label="New chat"
                onClick={(e) => { e.stopPropagation(); onNewChat(); }}
                sx={{
                  position: "absolute",
                  right: "40px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  transition: "opacity 120ms ease",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                }}
              >
                <NewChatIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            className="chat-thread-more-btn"
            aria-label="More options"
            onClick={handleOpenMenu}
            sx={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              transition: "opacity 120ms ease",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
            }}
          >
            <MoreIcon size="lg" />
          </IconButton>
        </Box>
      </Tooltip>

      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: "4px",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 2px rgba(0,0,0,0.08)",
              minWidth: "200px",
              py: "8px",
              border: `1px solid ${color.ui.divider.default.value}`,
            },
          },
        }}
      >
        {onPin && (
          <MenuItem
            onClick={() => { onPin(thread.id, isPinned); handleCloseMenu(); }}
            sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
          >
            <Stack direction="row" alignItems="center" gap="12px">
              <PinIcon size="md" />
              <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
                {isPinned ? "Unpin" : "Pin"}
              </Typography>
            </Stack>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => { onMoveToProject?.(thread.id); handleCloseMenu(); }}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <FolderIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
              Move to project
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleCloseMenu}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <EditIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: color.type.default.value }}>
              Rename
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleCloseMenu}
          sx={{ px: "16px", py: "12px", gap: 0, "&:hover": { backgroundColor: color.surface.variant.value } }}
        >
          <Stack direction="row" alignItems="center" gap="12px" sx={{ color: color.status.error.text.value }}>
            <TrashIcon size="md" />
            <Typography sx={{ fontSize: "14px", lineHeight: "20px", color: "inherit" }}>
              Delete
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}
