import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetTicketsQuery } from "@src/store/ticketing-api";
import { ListGridProps, SortOrder } from "@src/types/base/listing";
import { TicketsSortableField } from "@src/types/ticketing/list";
import { Ticket } from "@src/types/ticketing/ticket";
import { Link, useSearchParams } from "react-router-dom";
import ListGridComponent from "../common/list-grid.component";
import useTicketsColumns from "./tickets-config";

const TicketsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination
  const pagination = {
    page: Number(searchParams.get("page") || 1),
    limit: Number(
      searchParams.get("limit") || import.meta.env.VITE_DEFAULT_PAGE_SIZE || 15
    ),
    sortField: searchParams.get("sortField") || "",
    sortOrder: (searchParams.get("sortOrder") as SortOrder) || SortOrder.DESC,
  };
  const { page, limit, sortField, sortOrder } = pagination;

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  const { data, isLoading, isError } = useGetTicketsQuery({
    page,
    limit,
    sortField,
    sortOrder,
  });

  const listProps: ListGridProps<Ticket> = {
    columns: [...useTicketsColumns()],
    rows: data ? data.results : [],
    loading: isLoading,
    defaultSort: {
      field: TicketsSortableField.CREATED_DATE_FIELD,
      order: SortOrder.ASC,
    },
    pagination: {
      limit,
      page,
      totalResults: data ? data.totalResults : 0,
      handlePageChange,
      searchParams,
      setSearchParams,
    },
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Impossible de récupérer la liste des tickets
      </Alert>
    );
  }

  if (data) {
    return (
      <Box>
        <Typography variant="h4" align="center" my={2}>
          Liste des tickets
          <Link to={"/tickets/create"}>
            <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
              Créer un ticket
            </Button>
          </Link>
        </Typography>
        <ListGridComponent {...listProps} />
      </Box>
    );
  }

  return false;
};

export default TicketsList;
