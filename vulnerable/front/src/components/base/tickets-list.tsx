import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useGetTicketsQuery } from "@src/store/ticketing-api";
import { ListGridProps, SortOrder } from "@src/types/base/listing";
import { TicketsSortableField } from "@src/types/ticketing/list";
import { Ticket } from "@src/types/ticketing/ticket";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListGridComponent from "../common/list-grid.component";
import useTicketsColumns from "./tickets-config";

const TicketsList = () => {
  const navigate = useNavigate();
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
    columns: [...useTicketsColumns({ navigate })],
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
        <Typography>Liste des tickets</Typography>
        <ListGridComponent {...listProps} />
      </Box>
    );
  }

  return false;
};

export default TicketsList;
