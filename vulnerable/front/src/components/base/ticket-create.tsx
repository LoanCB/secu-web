import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const TicketCreate = () => {
  return (
    <Box>
      <Typography variant="h4" align="center" my={2}>
        Créer un ticket
        <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
          <Link to="/tickets">Retour à la liste</Link>
        </Button>
      </Typography>
    </Box>
  );
};

export default TicketCreate;
