import React, { useEffect, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box, Chip, IconButton, Button, Typography,
  Modal, Card, CardHeader, CardContent,
  Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import jwtAxios from "../../utils/axios";
import AddMenuPermission from "./AddMenuPermission";

interface MenuPermission {
  menuRolePermissionID: number;
  menuId: number;
  roleID: number;
  isRead: boolean;
  isWrite: boolean;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

export default function MenuPermissionList() {

  const [data, setData] = useState<MenuPermission[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (msg: string, type: "success" | "error" = "success") => {
    setSnackMessage(msg);
    setSnackSeverity(type);
    setSnackOpen(true);
  };


  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const permissionRes = await jwtAxios.get("/MenuPermission/PermissionList");
      const menuRes = await jwtAxios.get("/Menu/MenuList");
      const roleRes = await jwtAxios.get("/Role/GetRoles");

      setData(permissionRes.data);
      setMenus(menuRes.data);
      setRoles(roleRes.data);

    } finally { setLoading(false); }
  };

  

  const getMenuName = (menuId: number) =>
    menus.find(m => m.menuId === menuId)?.menuName || "";

  const getRoleName = (roleID: number) =>
    roles.find(r => r.roleID === roleID)?.roleName || "";


  const columns: MRT_ColumnDef<MenuPermission>[] = [
    {
      header: "Action",
      size: 80,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <IconButton size="small" color="warning"
          onClick={() => {
            setSelectedId(row.original.menuRolePermissionID);
            setIsEditMode(true);
            setOpen(true);
          }}>
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },

    { accessorKey: "menuRolePermissionID", header: "Permission ID" },

    { header: "Menu", Cell: ({ row }) => getMenuName(row.original.menuId) },

    { header: "Role", Cell: ({ row }) => getRoleName(row.original.roleID) },

    {
      accessorKey: "isRead",
      header: "Read",
      Cell: ({ cell }) =>
        cell.getValue<boolean>()
          ? <Chip label="Yes" color="success" size="small" />
          : <Chip label="No" size="small" />,
    },

    {
      accessorKey: "isWrite",
      header: "Write",
      Cell: ({ cell }) =>
        cell.getValue<boolean>()
          ? <Chip label="Yes" color="success" size="small" />
          : <Chip label="No" size="small" />,
    },
  ];


  return (
    <>
      <Box sx={{ height: "75vh", display: "flex", width: "90%", margin: "auto", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Menu Permission List</Typography>

          <Button variant="contained" sx={{ bgcolor: "#212529" }}
            onClick={() => { setSelectedId(null); setIsEditMode(false); setOpen(true); }}>
            Add Permission
          </Button>
        </Box>

        <Box sx={{ height: 500, overflow: "hidden" }}>
          <MaterialReactTable
            columns={columns}
            data={data}
            state={{ isLoading: loading }}
            enableColumnFilters
            enableSorting
            enableStickyHeader
            enableRowVirtualization
            enablePagination={false}
            initialState={{ density: "compact", showColumnFilters: true }}
            muiTableContainerProps={{ sx: { maxHeight: 450 } }}
          />
        </Box>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader
              title={isEditMode ? "Edit Permission" : "Add Permission"}
              titleTypographyProps={{ variant: "body1" }}
              sx={{ bgcolor: "#212529", color: "white", py: 1 }}
            />
            <CardContent>
              <AddMenuPermission
                permissionId={selectedId}
                isEditMode={isEditMode}
                closeModal={() => { setOpen(false); loadAll(); }}
                onSuccess={showSnackbar}
              />
            </CardContent>
          </Card>
        </Box>
      </Modal>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackSeverity} variant="filled">
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
