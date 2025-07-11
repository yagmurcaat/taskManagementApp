import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TamamlananGorevler from "./pages/TamamlananGorevler";
import PersonelIzin from "./pages/personelizin";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <Router>
      <CssBaseline />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sol Menü */}
        <aside
          style={{
            width: "220px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #ddd",
            padding: "30px 20px",
            paddingTop: "80px",
          }}
        >
          <h2 style={{ color: "#1976d2", marginBottom: "40px" }}>Menü</h2>
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "20px" }}>
                <Link
                  to="/"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/tamamlananlar"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    fontSize: "16px",
                  }}
                >
                  Tamamlanan Görevler
                </Link>
              </li>
              <li>
                <Link
                  to="/personelizin"
                  style={{
                    color: "black",
                    textDecoration: "none",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "block",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e3f2fd")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Personel İzin
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Sayfa İçeriği */}
        <main style={{ flex: 1, padding: "40px 40px 40px 60px" }}>
          {/* padding sol ve sağ biraz artırıldı */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tamamlananlar" element={<TamamlananGorevler />} />
            <Route path="/personelizin" element={<PersonelIzin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
