import React, { useState, useEffect } from "react";
import Header from "../Components/header";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageLayout from "../Components/PageLayout";

function Completed() {
  const [tasks, setTasks] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch("https://localhost:44314/api/Gorevler/ListTask")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Görevleri çekerken hata:", err));
  }, []);

  const handleToggleDone = (task) => {
    const updatedTask = { ...task, completed: !task.completed };

    fetch("https://localhost:44314/api/Gorevler/UpdateTask", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Güncelleme hatası:", err));
  

    
  };

  const handleDeleteTask = (id) => {
    fetch(`https://localhost:44314/api/Gorevler/DeleteTask/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Silme başarısız.");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        Swal.fire({
          icon: "success",
          title: "Silindi!",
          text: "Görev başarıyla silindi.",
          confirmButtonColor: "#3085d6",
        });
      })
      .catch((err) => {
        console.error("Silme hatası:", err);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Görev silinemedi.",
          confirmButtonColor: "#d33",
        });
      });
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const filteredTasks = completedTasks.filter((t) =>
    t.text.toLowerCase().includes(filterText.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <PageLayout>
      <div style={styles.inner}>
        <Header title="Tamamlanan Görevler" />

        <div
          style={{ ...styles.countCard, cursor: "pointer" }}
          onClick={() => setShowPopup(true)}
        >
          <h3>Toplam Tamamlanmış Görev</h3>
          <p style={styles.countNumber}>{completedTasks.length}</p>
        </div>

       

        {showPopup && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupContent}>
              <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
                Tamamlanan Görevler
              </h2>
              <div style={styles.cardContainer}>
               {filteredTasks.map((t) => (
  <div key={t.id} style={styles.taskCard}>
    <h4 style={{ textDecoration: "line-through", color: "#555" }}>{t.text}</h4>
    <p style={{ color: "#888" }}><strong>Tarih:</strong> {formatDate(t.date)}</p>
    <p style={{ color: "#888" }}>
      <strong>Öncelik:</strong>{" "}
      <span
        style={{
          color:
            t.oncelik === "kritik"
              ? "red"
              : t.oncelik === "orta"
              ? "orange"
              : "green",
          fontWeight: "bold",
        }}
      >
        {t.oncelik || "Belirtilmemiş"}
      </span>
    </p>
    <div style={{ marginTop: "10px" }}>
      <IconButton
        onClick={() => handleDeleteTask(t.id)}
        color="error"
        aria-label="delete"
        size="large"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  </div>
))}

              </div>
              <button style={styles.closeButton} onClick={() => setShowPopup(false)}>
                Kapat
              </button>
            </div>
          </div>
        )}

        <button onClick={() => navigate("/")} style={styles.navButton}>
          Ana Sayfaya Dön
        </button>
      </div>
    </PageLayout>
  );
}

const styles = {
  inner: {
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    padding: "40px 20px 80px",
  },
  countCard: {
    backgroundColor: "#add8e6",
    borderRadius: "12px",
    padding: "15px 25px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  countNumber: {
    fontSize: "26px",
    margin: 0,
  },
  input: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "18px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
    color: "#333",
    boxSizing: "border-box",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
  },
  closeButton: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  taskCard: {
    backgroundColor: "#e6f2ff",
    border: "1px solid #b3d1ff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  fab: {
    marginRight: "10px",
    width: "36px",
    height: "36px",
  },
  navButton: {
    marginTop: "35px",
    padding: "14px 28px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
    transition: "background-color 0.3s ease",
  },
};

export default Completed;
