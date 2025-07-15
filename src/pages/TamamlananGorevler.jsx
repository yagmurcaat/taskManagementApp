import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageLayout from "../Components/PageLayout";

function TamamlananGorevler() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [filterText, setFilterText] = useState("");
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

  const handleEditClick = (id, currentText, currentDate) => {
    setEditId(id);
    setEditText(currentText);
    setEditDate(currentDate);
  };

  const handleSaveClick = () => {
    const updatedTask = {
      id: editId,
      text: editText,
      date: editDate,
      completed: tasks.find((t) => t.id === editId)?.completed || false,
    };

    fetch("https://localhost:44314/api/Gorevler/UpdateTask", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setEditId(null);
        setEditText("");
        setEditDate("");
      })
      .catch((err) => console.error("Kaydetme hatası:", err));
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

        <div style={styles.countCard}>
          <h3>Toplam Tamamlanmış Görev</h3>
          <p style={styles.countNumber}>{completedTasks.length}</p>
        </div>

        <input
          type="text"
          placeholder="Görev filtrele..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={styles.input}
        />

        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Tamamlanmış görev yok.
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Görev</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} style={styles.completedRow}>
                  <td>
                    <Checkbox
                      checked={t.completed}
                      onChange={() => handleToggleDone(t)}
                      color="primary"
                    />
                  </td>
                  <td>
                    {editId === t.id ? (
                      <>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={styles.editInput}
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{ ...styles.editInput, marginTop: "8px" }}
                        />
                      </>
                    ) : (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontWeight: "500",
                        }}
                      >
                        {t.text}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(t.date)}</td>
                  <td>
                    {editId === t.id ? (
                      <button onClick={handleSaveClick} style={styles.saveButton}>
                        Kaydet
                      </button>
                    ) : (
                      <>
                        <Fab
                          color="warning"
                          size="small"
                          aria-label="edit"
                          onClick={() => handleEditClick(t.id, t.text, t.date)}
                          style={styles.fab}
                        >
                          <EditIcon />
                        </Fab>
                        <IconButton
                          onClick={() => handleDeleteTask(t.id)}
                          color="error"
                          aria-label="delete"
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  editInput: {
    width: "100%",
    padding: "14px 22px",
    fontSize: "17px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#111",
    boxSizing: "border-box",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: "17px",
    lineHeight: "1.6",
    marginTop: "20px",
  },
  completedRow: {
    backgroundColor: "#f0f4f8",
    color: "#999",
  },
  fab: {
    marginRight: "10px",
    width: "36px",
    height: "36px",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#388e3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
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

export default TamamlananGorevler;
