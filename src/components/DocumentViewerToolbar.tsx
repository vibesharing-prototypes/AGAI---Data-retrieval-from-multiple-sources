import { useState } from "react";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import ExpandLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandLeft";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import ZoomInIcon from "@diligentcorp/atlas-react-bundle/icons/ZoomIn";
import ZoomOutIcon from "@diligentcorp/atlas-react-bundle/icons/ZoomOut";

export const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  zoomIndex: number;
  onZoomIndexChange: (index: number) => void;
  onAgendaClick?: () => void;
  /** Show the View / Tools toggle pill (book reader only — omitted in the overlay doc preview). */
  showViewToggle?: boolean;
  /** Show the Agenda button (default true). Hidden for non-book documents. */
  showAgenda?: boolean;
  /** Distance from the bottom of the positioned container, in px. */
  bottomOffset?: number;
};

export default function DocumentViewerToolbar({
  currentPage,
  totalPages,
  onPageChange,
  zoomIndex,
  onZoomIndexChange,
  onAgendaClick,
  showViewToggle = false,
  showAgenda = true,
  bottomOffset = 25,
}: Props) {
  const { tokens: { semantic: { color } } } = useTheme();
  const [mode, setMode] = useState<"view" | "tools">("view");
  const zoomPct = ZOOM_LEVELS[zoomIndex];

  const labelSx = {
    color: color.action.secondary.onSecondary.value,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    lineHeight: "24px",
    letterSpacing: "0.2px",
    textTransform: "none",
    px: "12px",
    py: "4px",
    borderRadius: "8px",
    minWidth: 0,
  } as const;

  const iconButtonSx = { p: "4px", borderRadius: "8px", color: color.type.default.value } as const;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: `${bottomOffset}px`,
        left: "50%",
        transform: "translateX(-50%)",
        height: "52px",
        boxSizing: "border-box",
        backgroundColor: color.surface.default.value,
        borderRadius: "12px",
        outline: `1px ${color.outline.fixed.value} solid`,
        outlineOffset: "-1px",
        // Semantic / Shadow / Elevation / Low
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.10), 0px 8px 16px rgba(0, 0, 0, 0.10)",
        p: "8px",
        whiteSpace: "nowrap",
      }}
    >
      <Stack direction="row" alignItems="center" gap="20px" sx={{ height: "100%" }}>
        {/* View / Tools toggle pill — book reader only */}
        {showViewToggle && (
          <Stack
            direction="row"
            alignItems="center"
            gap="8px"
            sx={{
              height: "36px",
              boxSizing: "border-box",
              p: "2px",
              backgroundColor: color.action.secondary.hoverFill.value,
              borderRadius: "8px",
            }}
          >
            <Button
              variant="text"
              onClick={() => setMode("view")}
              sx={{
                ...labelSx,
                height: "32px",
                backgroundColor: mode === "view" ? color.surface.default.value : "transparent",
                boxShadow: mode === "view" ? "0px 1px 2px rgba(15,17,19,0.08)" : "none",
                "&:hover": {
                  backgroundColor: mode === "view" ? color.surface.default.value : "transparent",
                },
              }}
            >
              View
            </Button>
            {/* Tools is intentionally non-interactive in this prototype */}
            <Button
              variant="text"
              disableRipple
              tabIndex={-1}
              aria-disabled
              sx={{
                ...labelSx,
                height: "32px",
                backgroundColor: "transparent",
                boxShadow: "none",
                cursor: "default",
                pointerEvents: "none",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Tools
            </Button>
          </Stack>
        )}

        <Stack direction="row" alignItems="center" gap="8px">
          {showAgenda && (
            <Button variant="text" sx={labelSx} onClick={onAgendaClick}>
              Agenda
            </Button>
          )}

          {/* Page navigation */}
          <Stack direction="row" alignItems="center" gap="8px">
            <IconButton
              size="small"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              sx={iconButtonSx}
            >
              <ExpandLeftIcon size="lg" />
            </IconButton>
            <Stack direction="row" alignItems="center" gap="4px">
              <Box
                sx={{
                  width: 40,
                  height: 32,
                  px: "4px",
                  borderRadius: "4px",
                  outline: `1px ${color.ui.divider.default.value} solid`,
                  outlineOffset: "-1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    letterSpacing: "0.2px",
                    color: color.type.default.value,
                  }}
                >
                  {currentPage}
                </Typography>
              </Box>
              <Typography
                sx={{
                  width: 12,
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "0.2px",
                  color: color.type.default.value,
                }}
              >
                /
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "0.2px",
                  color: color.type.default.value,
                }}
              >
                {totalPages}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              sx={iconButtonSx}
            >
              <ExpandRightIcon size="lg" />
            </IconButton>
          </Stack>

          {/* Zoom controls */}
          <Stack direction="row" alignItems="center">
            <IconButton
              size="small"
              disabled={zoomIndex <= 0}
              onClick={() => onZoomIndexChange(Math.max(0, zoomIndex - 1))}
              sx={iconButtonSx}
            >
              <ZoomOutIcon size="lg" />
            </IconButton>
            <Button variant="text" sx={labelSx}>
              {zoomPct}%
            </Button>
            <IconButton
              size="small"
              disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
              onClick={() => onZoomIndexChange(Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1))}
              sx={iconButtonSx}
            >
              <ZoomInIcon size="lg" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
