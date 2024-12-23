import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { getUserProfile, updateUserProfile } from "../services/api";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await getUserProfile();
      setName(data.name);
      setEmail(data.email);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    await updateUserProfile({ name, email });
    alert("Profile updated successfully");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }} align="center">
          Profile
        </Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleUpdate}
        >
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
