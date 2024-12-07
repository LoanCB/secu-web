import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetTicketDetailsQuery } from "@src/store/ticketing-api";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const TicketDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetTicketDetailsQuery(Number(id));

  useEffect(() => {
    if (data) {
      const container = document.getElementById("BoxDescription");
      if (container) {
        const entities: { [key: string]: string } = {
          "&lt;": "<",
          "&gt;": ">",
          "&amp;": "&",
          "&quot;": '"',
          "&#39;": "'",
        };
        const description = data.description.replace(
          /&[^;]+;/g,
          (entity) => entities[entity] || entity
        );
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(description, "text/html");

        container.innerHTML = parsedHTML.body.innerHTML;

        const scripts = parsedHTML.querySelectorAll("script");
        scripts.forEach((script) => {
          const newScript = document.createElement("script");
          newScript.textContent = script.textContent; // Copy script content
          document.body.appendChild(newScript); // Append to body (or desired location)
        });
      }
    }
  }, [data]);

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
          {data.title}
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            <Link to="/tickets">Retour à la liste</Link>
          </Button>
        </Typography>
        <Box
          id="BoxDescription"
          sx={{ mt: 3 }}
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </Box>
    );
  }

  return false;
};

export default TicketDetails;
