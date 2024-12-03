import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import { IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ArchiveUserDto } from "@src/types/user/list";
import { LoggedUser, User } from "@src/types/user/user";

const useUsersColumns = ({
  handleArchiveUser,
  user,
}: {
  handleArchiveUser: ({ id, isActive }: ArchiveUserDto) => Promise<void>;
  user: User;
}): GridColDef<LoggedUser>[] => [
  {
    field: "id",
    flex: 0.5,
    headerName: "ID",
  },
  {
    field: "firstName",
    flex: 1,
    headerName: "Prénom",
  },
  {
    field: "lastName",
    flex: 1,
    headerName: "Nom",
  },
  {
    field: "email",
    flex: 1,
    headerName: "Email",
  },
  {
    field: "isActive",
    flex: 0.5,
    headerName: "Actif",
    renderCell: (param) =>
      param ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CancelIcon color="error" />
      ),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return [
        <Tooltip key="editUser" title="Éditer">
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>,
        params.row.isActive ? (
          <Tooltip key="archiveUser" title="Archiver">
            <IconButton
              color="secondary"
              onClick={() =>
                handleArchiveUser({
                  id: params.row.id,
                  isActive: !params.row.isActive,
                })
              }
              disabled={params.row.id === user.id}
            >
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip key="activateUser" title="Réactiver">
            <IconButton
              color="secondary"
              onClick={() =>
                handleArchiveUser({
                  id: params.row.id,
                  isActive: !params.row.isActive,
                })
              }
            >
              <ReplayCircleFilledIcon />
            </IconButton>
          </Tooltip>
        ),
      ];
    },
  },
];

export default useUsersColumns;
