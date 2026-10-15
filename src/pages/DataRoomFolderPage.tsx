import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Box, Button, Checkbox, Container, IconButton, InputAdornment, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme,
} from "@mui/material";
import { OverflowBreadcrumbs, PageHeader } from "@diligentcorp/atlas-react-bundle";
import AddIcon from "@diligentcorp/atlas-react-bundle/icons/Add";
import AddUserIcon from "@diligentcorp/atlas-react-bundle/icons/AddUser";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import ExportIcon from "@diligentcorp/atlas-react-bundle/icons/Export";
import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import PdfFileIcon from "@diligentcorp/atlas-react-bundle/icons/PdfFile";
import { DATA_ROOM_FOLDERS } from "../data/demo-products.js";

// AGAI integration use cases demo: a Data room folder. Data room is a different application, so the
// source chip's deep link lands in the right room and folder with the cited file selected.
export default function DataRoomFolderPage() {
  const { tokens: { semantic: { color }, core: { spacing } } } = useTheme();
  const navigate = useNavigate();
  const { folderId = "" } = useParams();
  const [params] = useSearchParams();
  const folder = DATA_ROOM_FOLDERS[folderId];
  const [checked, setChecked] = useState<string[]>(() => (params.get("file") ? [params.get("file") as string] : []));

  // A different folder (or deep link) starts with its own selection.
  useEffect(() => {
    const file = params.get("file");
    setChecked(file ? [file] : []);
  }, [folderId, params]);

  if (!folder) {
    return <Box sx={{ p: spacing["6"].value }}><Typography variant="h1" component="h1">We couldn't find this folder</Typography></Box>;
  }

  // Compact rows, as in the Data room product.
  const checkCellSx = { width: 48, minWidth: 48, maxWidth: 48, pl: "12px", pr: "12px", boxSizing: "border-box" as const };
  const cellSx = { py: "2px", px: "8px", verticalAlign: "middle" };

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Container maxWidth={false} sx={{ py: 2, maxWidth: 1376, mx: "auto" }}>
        <Stack gap={3}>
          <PageHeader
            pageTitle={folder.title}
            slotProps={{ backButton: { "aria-label": "Back", onClick: () => navigate(-1) } }}
            breadcrumbs={
              <OverflowBreadcrumbs
                leadingElement={<span>{folder.path}</span>}
                items={[{ id: "f", label: folder.title, url: "", isCurrent: true }]}
                hideLastItem
                aria-label="Breadcrumbs"
              >
                {({ label }) => <span>{label}</span>}
              </OverflowBreadcrumbs>
            }
            moreButton={
              <Stack direction="row" alignItems="center" gap={spacing["2"].value}>
                <Stack alignItems="flex-end">
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Data room storage</Typography>
                  <Typography variant="caption">
                    <Box component="span" sx={{ color: color.action.link.default.value, fontWeight: 600 }}>{folder.storageUsed}</Box>
                    {" / 1 GB"}
                  </Typography>
                </Stack>
                <IconButton aria-label="Add people"><AddUserIcon size="md" /></IconButton>
                <Button variant="contained" startIcon={<AddIcon size="md" />}>New</Button>
                <IconButton aria-label="More options"><MoreIcon size="md" /></IconButton>
              </Stack>
            }
          />
          <Stack direction="row" alignItems="center" gap={spacing["2"].value}>
            <TextField
              size="medium"
              placeholder="Search"
              inputProps={{ "aria-label": "Search" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon size="md" /></InputAdornment> }}
              sx={{ width: 240 }}
            />
            {checked.length > 0 && (
              <>
                <Typography variant="body2" aria-live="polite">
                  {checked.length} {checked.length === 1 ? "row" : "rows"} selected
                </Typography>
                <Button variant="text" startIcon={<EditIcon size="md" />}>Actions</Button>
              </>
            )}
            <Button variant="text" startIcon={<FilterIcon size="md" />}>Filters</Button>
            <Button variant="text" startIcon={<ExportIcon size="md" />}>Export CSV</Button>
          </Stack>
          <TableContainer>
            <Table size="small" aria-label="Files" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="none" sx={{ ...cellSx, ...checkCellSx }}>
                    <Checkbox
                      checked={checked.length === folder.files.length}
                      indeterminate={checked.length > 0 && checked.length < folder.files.length}
                      onChange={(e) => setChecked(e.target.checked ? folder.files.map((x) => x.id) : [])}
                      inputProps={{ "aria-label": "Select all files" }}
                    />
                  </TableCell>
                  <TableCell sx={cellSx}>Name</TableCell>
                  <TableCell sx={{ ...cellSx, width: 110 }}>Shared with</TableCell>
                  <TableCell sx={{ ...cellSx, width: 120 }}>Last modified</TableCell>
                  <TableCell sx={{ ...cellSx, width: 80 }}>Size</TableCell>
                  <TableCell padding="none" sx={{ ...cellSx, ...checkCellSx }}><span style={{ position: "absolute", left: -9999 }}>Actions</span></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {folder.files.map((f) => {
                  const isSelected = checked.includes(f.id);
                  return (
                    <TableRow
                      key={f.id}
                      selected={isSelected}
                      aria-current={isSelected ? "true" : undefined}
                      sx={isSelected ? { backgroundColor: color.action.secondary.active.value } : undefined}
                    >
                      <TableCell padding="none" sx={{ ...cellSx, ...checkCellSx }}>
                        <Checkbox checked={isSelected} onChange={() => setChecked((c) => (c.includes(f.id) ? c.filter((x) => x !== f.id) : [...c, f.id]))} inputProps={{ "aria-label": `Select ${f.name}` }} />
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Stack direction="row" alignItems="center" gap="8px" sx={{ minWidth: 0 }}>
                          <PdfFileIcon size="md" />
                          <Link component="button" type="button" underline="hover" title={f.name} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left", color: color.type.default.value }}>{f.name}</Link>
                        </Stack>
                      </TableCell>
                      <TableCell sx={cellSx}>{f.sharedWith}</TableCell>
                      <TableCell sx={cellSx}>{f.lastModified}</TableCell>
                      <TableCell sx={cellSx}>{f.size}</TableCell>
                      <TableCell padding="none" sx={{ ...cellSx, ...checkCellSx }}>
                        <IconButton size="small" aria-label={`More options for ${f.name}`}><MoreIcon size="md" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
}
