import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import TamamlananGorevler from "./pages/TamamlananGorevler";
import PersonelIzin from "./pages/personelizin";
import Sidebar from "./Components/Sidebar";
import Login from "./pages/Login";
import { CssBaseline } from "@mui/material";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sayfa ilk açıldığında oturum kontrolü yap
  useEffect(() => {
    const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(isAuth);
  }, []);

  return (
    <Router>
      <CssBaseline />

      {/* Kullanıcı giriş yaptıysa */}
      {isAuthenticated ? (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "40px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tamamlananlar" element={<TamamlananGorevler />} />
              <Route path="/personelizin" element={<PersonelIzin />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Kullanıcı giriş yapmadıysa sadece Login'e erişim sağla
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
