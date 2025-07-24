import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
const styles = {
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)",
    borderRight: "1px solid #ddd",
    padding: "40px 20px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // ⬅️ alt kısmı aktif eder
    alignItems: "stretch",
    overflowY: "auto",
    borderTopRightRadius: "40px",
    borderBottomRightRadius: "40px",
  },
  logo: {
    color: "#1565c0",
    fontWeight: "700",
    fontSize: "1.8rem",
    marginBottom: "50px",
    textAlign: "center",
    letterSpacing: "2px",
    userSelect: "none",
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: "20px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    textDecoration: "none",
    transition: "all 0.3s ease",
    boxShadow: "none",
    userSelect: "none",
    position: "relative",
  },
  icon: {
    marginRight: "12px",
    fontSize: "20px",
    flexShrink: 0,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "12px",
    bottom: "12px",
    width: "5px",
    backgroundColor: "#ff6f61",
    borderRadius: "4px",
  },
  logoutButton: {
    marginTop: "40px",
    padding: "12px",
    backgroundColor: "#ef5350",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Ana Sayfa", icon: <HomeIcon /> },
    { path: "/tamamlananlar", label: "Tamamlanan Görevler", icon: <CheckCircleIcon /> },
    { path: "/personelizin", label: "Personel İzin", icon: <EventNoteIcon /> },
     { path: "/register", label: "Kayıt Oluştur", icon: <PersonAddIcon /> },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>Görev Yönetimi</h2>
        <nav>
          <ul style={styles.ul}>
            {menuItems.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path} style={styles.li}>
                  <Link
                    to={path}
                    title={label}
                    style={{
                      ...styles.link,
                      backgroundColor: isActive ? "#1976d2" : "transparent",
                      color: isActive ? "white" : "#333",
                      boxShadow: isActive ? "0 4px 12px rgba(25, 118, 210, 0.4)" : "none",
                      position: "relative",
                      paddingLeft: "20px",
                    }}
                  >
                    {isActive && <span style={styles.activeBar}></span>}
                    <span
                      style={{
                        ...styles.icon,
                        color: isActive ? "white" : "#1976d2",
                        transition: "transform 0.3s ease",
                      }}
                      className="sidebar-icon"
                    >
                      {icon}
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 🚪 Oturumu Kapat Butonu */}
      <button
        style={styles.logoutButton}
        onClick={() => {
          sessionStorage.removeItem("isAuthenticated");
          window.location.href = "/login";
        }}
      >
        Oturumu Kapat
      </button>
    </aside>
  );
}

export default Sidebar;
