 import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Button,
  InputAdornment,
  CircularProgress,
  Backdrop,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [role, setRole] = useState("admin"); // admin ya da personel
  const navigate = useNavigate();

  const handleRoleChange = (_, newRole) => {
    if (newRole) setRole(newRole);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Kullanıcı adı ve şifre boş bırakılamaz.");
      return;
    }

    setError("");
    setLoading(true);
    setShowLoader(true);

    const endpoint =
  role === "admin"
    ? "https://localhost:44314/api/auth/Manager"   // ✔️ Doğru route bu
    : "https://localhost:44314/api/auth/Employee"; // ✔️ Zaten doğru

    setTimeout(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
          }),
        });

        const data = await res.json();

        if (res.ok) {
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("role", role); // Rolü de sakla
          setIsAuthenticated(true);

          if (role === "admin") {
            navigate("/", { replace: true });
          } else {
            navigate("/personel-paneli", { replace: true });
          }
        } else {
          setError(data.message || "Giriş başarısız.");
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    }, 1000);
  };

  return (
    <>
      <Backdrop open={showLoader} sx={{ color: "#fff", zIndex: 9999 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            minWidth: 300,
            backgroundColor: "#ffffff",
            color: "#1976d2",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Giriş yapılıyor...
          </Typography>
          <CircularProgress color="primary" />
        </Paper>
      </Backdrop>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e3f2fd, #90caf9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
              Giriş Yap
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" mb={2}>
              Giriş türünü seçin ve devam edin.
            </Typography>

            <ToggleButtonGroup
              color="primary"
              value={role}
              exclusive
              onChange={handleRoleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="admin">Yönetici Girişi</ToggleButton>
              <ToggleButton value="personel">Personel Girişi</ToggleButton>
            </ToggleButtonGroup>

            {error && (
              <Box
                sx={{
                  backgroundColor: "#ffcdd2",
                  color: "#b71c1c",
                  padding: 1.5,
                  borderRadius: 2,
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                {error}
              </Box>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                label="Kullanıcı Adı"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Şifre"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Giriş Yap"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Login