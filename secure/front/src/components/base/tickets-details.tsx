import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetTicketDetailsQuery } from "@src/store/ticketing-api";
import { Link, useParams } from "react-router-dom";

const TicketDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetTicketDetailsQuery(Number(id));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Impossible de récupérer le détail du ticket
      </Alert>
    );
  }

  if (data) {
    return (
      <Box>
        <Typography variant="h4" align="center" my={2}>
          {data[0].title}
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            <Link to="/tickets">Retour à la liste</Link>
          </Button>
        </Typography>
        <Box
          id="BoxDescription"
          sx={{ mt: 3 }}
          dangerouslySetInnerHTML={{ __html: data[0].description }}
        />
      </Box>
    );
  }

  return false;
};

export default TicketDetails;
