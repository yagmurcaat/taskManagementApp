import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

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
        icon: 'success',
        title: 'Silindi!',
        text: 'Görev başarıyla silindi.',
        confirmButtonColor: '#3085d6',
      });
    })
    .catch((err) => {
      console.error("Silme hatası:", err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Görev silinemedi.',
        confirmButtonColor: '#d33',
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Header title="Tamamlanmış Görevler" />

        <div style={styles.countCard}>
          <h3>Toplam Tamamlanmış Görev</h3>
          <p style={styles.countNumber}>{completedTasks.length}</p>
        </div>

        <div style={styles.spacer}></div>

        <div style={styles.filterInputs}>
          <input
            type="text"
            placeholder="Görev filtrele..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={styles.input}
          />
        </div>

        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>Tamamlanmış görev yok.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}></th>
                <th style={styles.th}>Görev</th>
                <th style={styles.th}>Tarih</th>
                <th style={styles.th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>
                    <Checkbox
                      checked={t.completed}
                      onChange={() => handleToggleDone(t)}
                      color="primary"
                    />
                  </td>
                  <td style={styles.td}>
                    {editId === t.id ? (
                      <>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={styles.input}
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{ ...styles.input, marginTop: "10px" }}
                        />
                      </>
                    ) : (
                      <span
                        style={{
                          textDecoration: t.completed ? "line-through" : "none",
                          color: t.completed ? "gray" : "black",
                        }}
                      >
                        {t.text}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>{formatDate(t.date)}</td>
                  <td style={styles.td}>
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
                          size="large"
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={() => navigate("/")} style={styles.backButton}>
          Ana Sayfaya Geri Dön
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  container: {
  
    margin: "5px auto",
    backgroundColor: "#f2f5f7",
   paddingTop: "60px",
paddingBottom: "150px",
paddingLeft: "300px",
paddingRight: "320px",

    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  box: {
    padding: "100px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  countCard: {
    backgroundColor: "#81c784", // Daha açık yeşil
    color: "white",
    borderRadius: "12px",
    padding: "15px 25px",
    textAlign: "center",
     // Daha küçük genişlik
    fontWeight: "bold",
    fontSize: "18px",
    userSelect: "none",
  },
  countNumber: {
    fontSize: "26px",
    margin: 0,
  },
  spacer: {
    height: "20px", // yeşil kutu ile tablo arası boşluk
  },
  filterInputs: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    verticalAlign: "middle",
  },
  fab: {
    marginRight: "6px",
    width: "40px",
    height: "40px",
  },
  saveButton: {
    padding: "6px 12px",
    backgroundColor: "#388e3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default TamamlananGorevler;
