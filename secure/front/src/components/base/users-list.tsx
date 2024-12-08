import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import {
  useArchiveUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUsersListQuery,
} from "@src/store/auth-api";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import { openSnackBar } from "@src/store/notification-slice";
import { RootState } from "@src/store/store";
import { ListGridProps, SortOrder } from "@src/types/base/listing";
import { ArchiveUserDto, UsersSortableField } from "@src/types/user/list";
import { RoleType } from "@src/types/user/role";
import { LoggedUser, User } from "@src/types/user/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import CustomFormField from "../common/custom-form-field.component";
import ListGridComponent from "../common/list-grid.component";
import useUsersColumns from "./users-config";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const zodSchema = z
  .object({
    firstName: z.string().min(1, { message: "Prénom requis" }),
    lastName: z.string().min(1, { message: "Nom requis" }),
    email: z.string().email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Mot de passe trop court" }),
    confirmPassword: z.string().min(8, { message: "Mot de passe trop court" }),
    role: z.nativeEnum(RoleType),
    isActive: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe doivent être identiques",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof zodSchema>;
export interface UserFormData extends FormData {
  id?: number;
}

const defaultValues: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: RoleType.READ_ONLY,
  isActive: true,
};

const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const user: User | null = useAppSelector((state: RootState) => state.user);

  const [openModal, setOpenModal] = useState(false);
  const [editUserId, setEditUserId] = useState<null | number>(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    reset(defaultValues);
  };

  const [archiveUser] = useArchiveUserMutation();
  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues,
  });

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

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const handleFormSubmit = async (data: FormData) => {
    if (editUserId) {
      const response = await updateUser({ ...data, id: editUserId });
      if (response.error) {
        dispatch(
          openSnackBar({
            message: "Erreur lors de l'édition d'un utilisateur",
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackBar({
            message: "Utilisateur modifié avec succès",
            severity: "success",
          })
        );
        setOpenModal(false);
        setEditUserId(null);
        reset(defaultValues);
      }
    } else {
      const response = await createUser(data);
      if (response.error) {
        dispatch(
          openSnackBar({
            message: "Erreur lors de la création d'un utilisateur",
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackBar({
            message: "Utilisateur créé avec succès",
            severity: "success",
          })
        );
        setOpenModal(false);
        reset(defaultValues);
      }
    }
  };

  const handleOpenEditModal = (data: LoggedUser) => {
    reset({
      ...data,
      role: data.role.name,
    });
    setEditUserId(data.id);
    setOpenModal(true);
  };

  const { data, isLoading, isError } = useUsersListQuery({
    page,
    limit,
    sortField,
    sortOrder,
  });

  const listProps: ListGridProps<LoggedUser> = {
    columns: [
      ...useUsersColumns({ handleArchiveUser, user, handleOpenEditModal }),
    ],
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
        <Typography variant="h4" align="center" my={2}>
          Liste des utilisateurs
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={() => setOpenModal(true)}
          >
            Créer un utilisateur
          </Button>
        </Typography>
        <ListGridComponent {...listProps} />
        <Modal open={openModal} onClose={handleCloseModal}>
          <Stack
            component="form"
            onSubmit={handleSubmit((data) => handleFormSubmit(data))}
            alignItems={"center"}
            spacing={2}
            margin={"2rem auto"}
            sx={modalStyle}
          >
            <h1>Nouvel utilisateur</h1>

            <Stack direction={"row"} spacing={2} minWidth={"100%"}>
              <CustomFormField
                childrenComponentType="TEXT_FIELD"
                control={control}
                controlName="firstName"
                options={{ label: "Prénom" }}
              />
              <CustomFormField
                childrenComponentType="TEXT_FIELD"
                control={control}
                controlName="lastName"
                options={{ label: "Nom" }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2} minWidth={"100%"}>
              <CustomFormField
                childrenComponentType="TEXT_FIELD"
                control={control}
                controlName="email"
                options={{ label: "Email" }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2} minWidth={"100%"}>
              <CustomFormField
                childrenComponentType="TEXT_FIELD"
                control={control}
                controlName="password"
                options={{ label: "Mot de passe" }}
                props={{ type: "password" }}
              />
              <CustomFormField
                childrenComponentType="TEXT_FIELD"
                control={control}
                controlName="confirmPassword"
                options={{ label: "Confirmer le mot de passe" }}
                props={{ type: "password" }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2} minWidth={"100%"}>
              <CustomFormField
                childrenComponentType="SELECT"
                control={control}
                controlName="role"
                options={{
                  label: "Role",
                  items: [
                    { text: "Simple utilisateur", value: RoleType.READ_ONLY },
                    { text: "Manager", value: RoleType.MANAGER },
                    { text: "Administrateur", value: RoleType.ADMINISTRATOR },
                  ],
                }}
              />
              <CustomFormField
                childrenComponentType="CHECKBOX"
                control={control}
                controlName="isActive"
                options={{ label: "Actif", checked: watch("isActive") }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <Button variant="contained" type="submit">
                Créer l'utilisateur
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => handleCloseModal()}
              >
                Annuler
              </Button>
            </Stack>
          </Stack>
        </Modal>
      </Box>
    );
  }

  return false;
};

export default UsersList;
