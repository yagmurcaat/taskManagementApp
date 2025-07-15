import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TamamlananGorevler from "./pages/TamamlananGorevler";
import PersonelIzin from "./pages/personelizin";
import Sidebar from "./Components/Sidebar";

import { CssBaseline } from "@mui/material";

function App() {
  return (
    <Router>
      <CssBaseline />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "40px" }}>
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
