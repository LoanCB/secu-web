import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetCountersQuery } from "@src/store/ticketing-api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCountersQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (data) {
    return (
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Mes tickets
            </Typography>
            <Typography variant="h5" component="div">
              {data.ticketCount}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate("/tickets")}>
              Consulter
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Mes Fichiers
            </Typography>
            <Typography variant="h5" component="div">
              {data.fileCount}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate("/files")}>
              Consulter
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
  }

  return false;
};

export default Dashboard;
