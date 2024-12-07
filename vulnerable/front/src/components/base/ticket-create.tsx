import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch } from "@src/store/hooks";
import { openSnackBar } from "@src/store/notification-slice";
import { useCreateTicketMutation } from "@src/store/ticketing-api";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import CustomFormField from "../common/custom-form-field.component";
import CustomRichTextEditor from "../common/custom-rich-text.component";

const zodSchema = z.object({
  title: z.string().min(1, { message: "Titre requis" }),
  description: z.string().min(1, { message: "Description requis" }),
});
export type TicketFormData = z.infer<typeof zodSchema>;

const defaultValues: TicketFormData = {
  title: "",
  description: "",
};

const TicketCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();

  const { control, handleSubmit } = useForm<TicketFormData>({
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues,
  });

  const [createTicket] = useCreateTicketMutation();
  const handleFormSubmit = async (data: TicketFormData) => {
    const response = await createTicket(data);
    if (response.error) {
      dispatch(
        openSnackBar({
          message: "Error lors de la création du ticket",
          severity: "error",
        })
      );
    } else {
      dispatch(
        openSnackBar({
          message: "Ticket créé avec succès",
          severity: "success",
        })
      );
      navigate("/tickets");
    }
  };

  return (
    <Box>
      <Typography variant="h4" align="center" my={2}>
        Créer un ticket
        <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
          <Link to="/tickets">Retour à la liste</Link>
        </Button>
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        sx={{ display: "flex", flexDirection: "column", gap: 3, mx: 3 }}
      >
        <CustomFormField
          childrenComponentType="TEXT_FIELD"
          control={control}
          controlName="title"
          options={{ label: "Titre" }}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth>
              <CustomRichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
              <FormHelperText sx={{ color: palette.error.main }}>
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Button type="submit" variant="contained">
          Créer le ticket
        </Button>
      </Box>
    </Box>
  );
};

export default TicketCreate;
