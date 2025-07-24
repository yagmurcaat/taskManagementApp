import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import TamamlananGorevler from "./pages/Completed";
import PersonelIzin from "./pages/staffleave";
import Sidebar from "./Components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Yeni kayıt sayfası
import { CssBaseline } from "@mui/material";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(isAuth);
  }, []);

  return (
    <Router>
      <CssBaseline />

      {isAuthenticated ? (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "40px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tamamlananlar" element={<TamamlananGorevler />} />
              <Route path="/personelizin" element={<PersonelIzin />} />
              <Route path="/register" element={<Register />} /> {/* Kayıt sayfası erişilebilir */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Giriş yapılmadıysa sadece Login ve Register sayfasına izin ver
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />  {/* Kayıt sayfası */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
