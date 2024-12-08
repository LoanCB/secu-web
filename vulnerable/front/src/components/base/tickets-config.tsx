import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Ticket } from "@src/types/ticketing/ticket";
import { User } from "@src/types/user/user";
import { Link } from "react-router-dom";

const useTicketsColumns = (): GridColDef<Ticket>[] => [
  {
    field: "id",
    flex: 0.5,
    headerName: "ID",
  },
  {
    field: "title",
    flex: 2,
    headerName: "Titre",
  },
  {
    field: "user",
    flex: 1,
    headerName: "Utilisateur",
    valueGetter: (value: User) => value.email,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => [
      <Button>
        <Link to={`/tickets/${params.row.id}`}>Voir le détail</Link>
      </Button>,
    ],
  },
];

export default useTicketsColumns;
