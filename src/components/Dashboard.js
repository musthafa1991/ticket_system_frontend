import React from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import CreateTicket from "./CreateTicket";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { auth, loading, fetchRoleData } = useAuthContext();
  const navigate = useNavigate();

  const handleTicketCreated = async () => {
    if (auth.user) {
      await fetchRoleData(auth.user);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", padding: "24px" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!auth.user) {
    return (
      <Container>
        <Box sx={{ padding: "24px" }}>
          <Typography variant="h6">No data available, Please Login</Typography>
          {/* <CreateTicket onTicketCreated={handleTicketCreated} /> */}
        </Box>
      </Container>
    );
  }

  if (!auth.roleData || auth.roleData.length === 0) {
    return (
      <Container>
        <Box sx={{ padding: "24px" }}>
          <Typography variant="h6">No Ticket Available</Typography>
          <CreateTicket onTicketCreated={handleTicketCreated} />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ padding: "24px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <CreateTicket onTicketCreated={handleTicketCreated} />
      </Box>
      <Grid container spacing={2}>
        {auth.roleData.map((ticket) => (
          <Grid item xs={12} md={6} key={ticket._id}>
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
              }}
              onClick={() => navigate(`/tickets/${ticket._id}`)}
            >
              <Typography variant="h6">{ticket.title}</Typography>
              <Typography variant="body2">{ticket.description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
