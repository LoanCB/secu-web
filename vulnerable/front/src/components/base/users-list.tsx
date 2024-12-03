import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useArchiveUserMutation, useUsersListQuery } from "@src/store/auth-api";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { openSnackBar } from "@src/store/notification-slice";
import { RootState } from "@src/store/store";
import { ListGridProps, SortOrder } from "@src/types/base/listing";
import { ArchiveUserDto, UsersSortableField } from "@src/types/user/list";
import { LoggedUser, User } from "@src/types/user/user";
import { useSearchParams } from "react-router-dom";
import ListGridComponent from "../common/list-grid.component";
import useUsersColumns from "./users-config";

const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const user: User | null = useAppSelector((state: RootState) => state.user);

  const [archiveUser] = useArchiveUserMutation();

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

  const handleArchiveUser = async ({ id, isActive }: ArchiveUserDto) => {
    try {
      const response = await archiveUser({ id, isActive });
      if (response.error) {
        dispatch(
          openSnackBar({
            message: "Erreur lors de l'archivage",
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackBar({
            message: `Utilisateur ${isActive ? "réactivé" : "archivé"}`,
            severity: "success",
          })
        );
      }
    } catch {
      dispatch(
        openSnackBar({
          message: "Erreur lors de l'archivage",
          severity: "error",
        })
      );
    }
  };

  const { data, isLoading, isError } = useUsersListQuery({
    page,
    limit,
    sortField,
    sortOrder,
  });

  const listProps: ListGridProps<LoggedUser> = {
    columns: [...useUsersColumns({ handleArchiveUser, user })],
    rows: data ? data.results : [],
    loading: isLoading,
    defaultSort: {
      field: UsersSortableField.CREATED_DATE_FIELD,
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
        Impossible de récupérer la liste des utilisateurs
      </Alert>
    );
  }

  if (data) {
    return (
      <Box>
        <Typography>Liste des utilisateurs</Typography>
        <ListGridComponent {...listProps} />
      </Box>
    );
  }

  return false;
};

export default UsersList;
