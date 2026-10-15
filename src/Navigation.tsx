import { RoutedNavLink, NavLink, NavSection } from "@diligentcorp/atlas-react-bundle/global-nav";
import CurrentBooksIcon from "@diligentcorp/atlas-react-bundle/icons/CurrentBooks";
import HomeIcon from "@diligentcorp/atlas-react-bundle/icons/Home";
import ResourceCenterIcon from "@diligentcorp/atlas-react-bundle/icons/ResourceCenter";
import OrganizationIcon from "@diligentcorp/atlas-react-bundle/icons/Organization";
import ClipboardCheckIcon from "@diligentcorp/atlas-react-bundle/icons/ClipboardCheck";
import ExpandLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandLeft";
import { Box, SvgIcon, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import ExpandDownIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandDown";
import ExpandRightIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandRight";
import ExpandUpIcon from "@diligentcorp/atlas-react-bundle/icons/ExpandUp";
import TeamDataRoomIcon from "@diligentcorp/atlas-react-bundle/icons/TeamDataRoom";
import TrashIcon from "@diligentcorp/atlas-react-bundle/icons/Trash";
import ChartBarIcon from "@diligentcorp/atlas-react-bundle/icons/ChartBar";
import VisibleIcon from "@diligentcorp/atlas-react-bundle/icons/Visible";
import PolicyIcon from "@diligentcorp/atlas-react-bundle/icons/Policy";
import WatermarkIcon from "@diligentcorp/atlas-react-bundle/icons/Watermark";
import QuestionnairesIcon from "@diligentcorp/atlas-react-bundle/icons/Questionnaires";
import UserManagementIcon from "@diligentcorp/atlas-react-bundle/icons/UserManagement";
import { NavLink as RouterNavLink, useLocation } from "react-router";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import { DATA_ROOM_FOLDERS, DATA_ROOM_NAV_FOLDERS } from "./data/demo-products.js";
import AppNavHeader from "./components/AppNavHeader.js";

type Persona = "admin" | "director" | "dataroom";

function BoardsNavLink() {
  return (
    <NavLink label="Boards" as="span" style={{ marginTop: "12px" }}>
      <ExpandLeftIcon slot="icon" />
    </NavLink>
  );
}

function usePersona(): Persona {
  const { pathname } = useLocation();
  if (pathname.startsWith("/data-room")) return "dataroom";
  if (pathname === "/books" || pathname.startsWith("/books/") || pathname.startsWith("/admin")) {
    return "admin";
  }
  return "director";
}

function DirectorBooksNavLink() {
  const { pathname } = useLocation();
  const isActive = pathname === "/director/books" || pathname.startsWith("/director/books/");
  return (
    <RouterNavLink to="/director/books">
      <NavLink as="span" label="Books" isCurrent={isActive}>
        <CurrentBooksIcon slot="icon" />
      </NavLink>
    </RouterNavLink>
  );
}

function AdminBooksNavLink() {
  const { pathname } = useLocation();
  const isActive =
    pathname === "/admin/books" ||
    pathname.startsWith("/admin/books/") ||
    pathname === "/books" ||
    pathname.startsWith("/books/");
  return (
    <RouterNavLink to="/admin/books">
      <NavLink as="span" label="Books" isCurrent={isActive}>
        <CurrentBooksIcon slot="icon" />
      </NavLink>
    </RouterNavLink>
  );
}

function SmartBuilderIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M6 9.83398L3.67969 10.7041L7.19043 20.0693L12.0449 18.249H16.3096L6.31543 21.999L1.75 9.8291L6 8.23438V9.83398ZM20.5 3.23438V16.2344H7.5V3.23438H20.5ZM9 4.73438V14.7344H19V4.73438H9ZM15.085 8.64941L17.25 9.73438L15.085 10.8193L14 12.9844L12.915 10.8193L10.75 9.73438L12.915 8.64941L14 6.48438L15.085 8.64941Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function DecisionHubIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M17.8457 20.25C18.2596 20.2504 18.5957 20.586 18.5957 21C18.5957 21.414 18.2596 21.7496 17.8457 21.75H5.40527C4.99106 21.75 4.65527 21.4142 4.65527 21C4.65527 20.5858 4.99106 20.25 5.40527 20.25H17.8457Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5947 2.25C11.7397 2.25 11.8852 2.25539 12.0352 2.27539C13.6801 2.48048 14.9848 3.87046 15.0898 5.52539C15.1298 6.22016 14.9748 6.86984 14.6699 7.42969C14.1699 8.33469 13.8447 9.32547 13.8447 10.3555C13.845 11.9553 15.1404 13.25 16.7402 13.25H17.25C18.355 13.25 19.25 14.145 19.25 15.25V18H4V15.25C4 14.145 4.895 13.25 6 13.25H6.4502C8.04995 13.2499 9.34447 11.9552 9.34473 10.3555V10.1348C9.34468 9.20485 9.04516 8.31946 8.5752 7.51953C8.27029 6.99959 8.09473 6.39489 8.09473 5.75C8.09473 3.81509 9.66485 2.25015 11.5947 2.25ZM11.5996 3.75977C10.4949 3.75998 9.59974 4.655 9.59961 5.75977C9.59961 6.11463 9.69513 6.46461 9.875 6.76953C10.5199 7.87442 10.8495 9.00477 10.8496 10.1396V10.3604C10.8494 12.7852 8.87993 14.7548 6.45508 14.7549H6.00488C5.72998 14.7549 5.50495 14.98 5.50488 15.2549V16.5049H17.7549V15.2549C17.7548 14.9799 17.5298 14.7549 17.2549 14.7549H16.7451C14.3202 14.7549 12.3498 12.7852 12.3496 10.3604C12.3496 9.15535 12.6904 7.92496 13.3604 6.70996C13.5353 6.38007 13.6197 6.01008 13.5947 5.61523C13.5347 4.68023 12.7846 3.87965 11.8496 3.76465L11.5996 3.75977Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

function TasksNavLink() {
  const { pathname } = useLocation();
  return (
    <RouterNavLink to="/tasks">
      <NavLink as="span" label="Tasks" isCurrent={pathname === "/tasks" || pathname.startsWith("/tasks/")}>
        <ClipboardCheckIcon slot="icon" />
      </NavLink>
    </RouterNavLink>
  );
}

function DecisionHubNavLink() {
  const { pathname } = useLocation();
  return (
    <NavLink label="Decision Hub" as="span" isCurrent={pathname.startsWith("/decision-hub")}>
      <DecisionHubIcon slot="icon" />
    </NavLink>
  );
}

// Data Room is a separate application: it has its own navigation, with card-style
// sections (Private workspace, Data rooms, Flows, Organization).
const FOLDER_ID = /^\/data-room\/([^/]+)/;

function NavCard({ label, trailing, filled }: { label: string; trailing: ReactNode; filled?: boolean }) {
  const { tokens: { semantic: { color } } } = useTheme();
  return (
    <Box
      sx={{
        mx: "12px",
        mb: "8px",
        border: `1px solid ${color.outline.fixed.value}`,
        borderRadius: "12px",
        backgroundColor: filled ? color.surface.variant.value : "transparent",
        display: "flex",
        alignItems: "center",
        px: "12px",
        height: 48,
        fontSize: 14,
        color: color.type.default.value,
      }}
    >
      <Box component="span" sx={{ flex: 1 }}>{label}</Box>
      {trailing}
    </Box>
  );
}

// A data room: plain row when collapsed, bordered card when open. Selected rooms
// show the blue label and left bar; the card border itself stays neutral.
function RoomRow({ label, open, selected, children }: { label: string; open?: boolean; selected?: boolean; children?: ReactNode }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const blue = color.action.link.default.value;
  return (
    <Box
      sx={{
        mx: "12px",
        mb: "8px",
        border: `1px solid ${open ? color.outline.fixed.value : "transparent"}`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          px: "12px",
          height: 48,
          fontSize: 14,
          color: selected ? blue : color.type.default.value,
          "&::before": selected
            ? { content: '""', position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "2px", backgroundColor: blue }
            : undefined,
        }}
      >
        <TeamDataRoomIcon size="md" />
        <Box component="span" sx={{ flex: 1 }}>{label}</Box>
        {open ? <ExpandUpIcon size="md" /> : <ExpandDownIcon size="md" />}
      </Box>
      {open && children}
    </Box>
  );
}

function NavRow({ label, icon, current, to, indent }: { label: string; icon?: ReactNode; current?: boolean; to?: string; indent?: boolean }) {
  const { tokens: { semantic: { color } } } = useTheme();
  const row = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        height: indent ? 36 : 48,
        pl: indent ? "20px" : "12px",
        pr: "12px",
        mx: indent ? "4px" : 0,
        borderRadius: "8px",
        fontSize: indent ? 13 : 14,
        color: current ? color.action.link.default.value : color.type.default.value,
        backgroundColor: current ? color.action.secondary.active.value : "transparent",
      }}
    >
      {icon}
      {label}
    </Box>
  );
  return to ? <RouterNavLink to={to} style={{ textDecoration: "none", color: "inherit" }}>{row}</RouterNavLink> : row;
}

function DataRoomNavigation() {
  const { pathname } = useLocation();
  const currentFolder = pathname.match(FOLDER_ID)?.[1];
  return (
    <>
      <AppNavHeader />
      <Box component="nav" aria-label="Data Room" sx={{ pt: "8px" }}>
        <NavCard label="Private workspace" trailing={<ExpandRightIcon size="md" />} />
        <NavCard label="Data rooms" filled trailing={<ExpandDownIcon size="md" />} />
        <RoomRow label="Risk Committee" open selected>
          <NavRow label="Files" icon={<ExpandDownIcon size="sm" />} />
          {DATA_ROOM_NAV_FOLDERS.map((id) => (
            <NavRow
              key={id}
              indent
              to={`/data-room/${id}`}
              label={DATA_ROOM_FOLDERS[id].title}
              current={id === currentFolder}
              icon={id === currentFolder ? <ExpandDownIcon size="sm" /> : <ExpandRightIcon size="sm" />}
            />
          ))}
          <NavRow label="Deleted items" icon={<TrashIcon size="md" />} />
          <NavRow label="Insights" icon={<ChartBarIcon size="md" />} />
          <NavRow label="Members and groups" icon={<UserManagementIcon size="md" />} />
          <NavRow label="Access overview" icon={<VisibleIcon size="md" />} />
          <NavRow label="Conditions of access" icon={<DocumentIcon size="md" />} />
          <NavRow label="Policies" icon={<PolicyIcon size="md" />} />
          <NavRow label="Custom watermark" icon={<WatermarkIcon size="md" />} />
        </RoomRow>
        <RoomRow label="Audit Committee" />
        <NavCard label="Flows" trailing={<ExpandRightIcon size="md" />} />
        <NavCard label="Organization" trailing={<ExpandRightIcon size="md" />} />
      </Box>
    </>
  );
}

function DirectorNavigation() {
  return (
    <>
      <AppNavHeader />
      <BoardsNavLink />
      <RoutedNavLink to="/director" end label="Home">
        <HomeIcon slot="icon" />
      </RoutedNavLink>
      <DirectorBooksNavLink />
      <RoutedNavLink to="/director/resource-center" label="Resource Center">
        <ResourceCenterIcon slot="icon" />
      </RoutedNavLink>
      <NavLink label="Smart Builder" as="span">
        <SmartBuilderIcon slot="icon" />
      </NavLink>
      <DecisionHubNavLink />
      <TasksNavLink />
      <NavLink label="Questionnaires" as="span">
        <QuestionnairesIcon slot="icon" />
      </NavLink>
      <hr />
      <NavLink label="Boards account" as="span">
        <UserManagementIcon slot="icon" />
      </NavLink>
    </>
  );
}

function ApplicationManagementSection() {
  const { pathname } = useLocation();
  const isOrgSettings = pathname.startsWith("/admin/settings");

  return (
    <NavSection label="Application management" expandStart isOpen>
      <OrganizationIcon slot="icon" />
      <NavLink label="Users" as="span" />
      <NavLink label="Committees" as="span" />
      <RouterNavLink to="/admin/settings">
        <NavLink as="span" label="Organization settings" isCurrent={isOrgSettings} />
      </RouterNavLink>
    </NavSection>
  );
}

function AdminNavigation() {
  return (
    <>
      <AppNavHeader />
      <BoardsNavLink />
      <AdminBooksNavLink />
      <RoutedNavLink to="/admin/resource-center" label="Resource Center">
        <ResourceCenterIcon slot="icon" />
      </RoutedNavLink>
      <NavLink label="Smart Builder" as="span">
        <SmartBuilderIcon slot="icon" />
      </NavLink>
      <DecisionHubNavLink />
      <TasksNavLink />
      <NavLink label="Questionnaires" as="span">
        <QuestionnairesIcon slot="icon" />
      </NavLink>
      <hr />
      <NavLink label="Boards account" as="span">
        <UserManagementIcon slot="icon" />
      </NavLink>
      <ApplicationManagementSection />
    </>
  );
}

export default function Navigation() {
  const persona = usePersona();
  if (persona === "dataroom") return <DataRoomNavigation />;
  return persona === "admin" ? <AdminNavigation /> : <DirectorNavigation />;
}
