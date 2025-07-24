import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Container,
  Alert,
  
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PageLayout from "../Components/PageLayout";

function Register() {
   
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { username, password };

    try {
      const res = await fetch("https://localhost:44314/api/auth/Employee/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage("Hata: " + (data.message || "Kayıt başarısız."));
        return;
      }

      setIsError(false);
      setMessage("✅ Kayıt başarılı! Kullanıcı ID: " + data.employee.id);
      setUsername("");
      setPassword("");
    } catch (error) {
      setIsError(true);
      setMessage("Sunucu hatası: " + error.message);
    }
  };

  return (
   <PageLayout>
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #bbdefb, #90caf9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Box textAlign="center" mb={3}>
            <PersonAddIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Kayıt Oluştur
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yeni bir kullanıcı hesabı oluşturun
            </Typography>
          </Box>

          {message && (
            <Alert severity={isError ? "error" : "success"} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Kullanıcı Adı"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Parola"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Kaydet
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
    </PageLayout>
  );
}

export default Register;
