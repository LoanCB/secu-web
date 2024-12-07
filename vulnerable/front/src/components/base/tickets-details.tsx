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
        <Typography>
          {data.title}
          <Button>
            <Link to="/tickets">Retour à la liste</Link>
          </Button>
        </Typography>
        {data.description}
      </Box>
    );
  }

  return false;
};

export default TicketDetails;
