import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2';



function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
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

  const handleAddTask = () => {
    if (!newTaskText.trim() || !newTaskDate) {
      alert("Lütfen görev ve tarih giriniz!");
      return;
    }

    const newTask = {
      text: newTaskText,
      date: newTaskDate,
      completed: false,
    };

    fetch("https://localhost:44314/api/Gorevler/AddTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setNewTaskText("");
        setNewTaskDate("");
      })
      .catch((err) => console.error("Görev ekleme hatası:", err));
  };

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


  const filteredTasks = tasks.filter((t) =>
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
    <div style={styles.container}>
      <Header title="Yapılacaklar Listesi" />

      <div style={styles.box}>
        <h2 style={styles.title}>Yeni Görev Ekle</h2>
        <input
          type="text"
          placeholder="Görev yazınız"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={newTaskDate}
          onChange={(e) => setNewTaskDate(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddTask} style={styles.addButton}>
          Ekle
        </button>

        <h3 style={styles.subtitle}>Görevleri Filtrele</h3>
        <input
          type="text"
          placeholder="Görev ara..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={styles.input}
        />

        <h3 style={styles.subtitle}>Görev Listesi</h3>
        {filteredTasks.length === 0 ? (
          <p>Görev bulunamadı.</p>
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
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleToggleDone(task)}
                      color="primary"
                    />
                  </td>
                  <td>
                    {editId === task.id ? (
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
                          style={{ ...styles.input, marginTop: "8px" }}
                        />
                      </>
                    ) : (
                      <span
                        style={{
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? "gray" : "black",
                        }}
                      >
                        {task.text}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(task.date)}</td>
                  <td>
                    {editId === task.id ? (
                      <button onClick={handleSaveClick} style={styles.saveButton}>
                        Kaydet
                      </button>
                    ) : (
                      <>
                        <Fab
                          color="warning"
                          size="small"
                          aria-label="edit"
                          onClick={() =>
                            handleEditClick(task.id, task.text, task.date)
                          }
                          style={styles.fab}
                        >
                          <EditIcon />
                        </Fab>
                        <IconButton
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                          aria-label="delete"
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

        <button
          onClick={() => navigate("/tamamlananlar")}
          style={styles.navButton}
        >
          Tamamlanan Görevler Sayfasına Git
        </button>
      </div>
    </div>
  );
}

const styles = {
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
  title: {
    marginBottom: "12px",
  },
  subtitle: {
    marginTop: "25px",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  fab: {
    marginRight: "8px",
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
  navButton: {
    marginTop: "20px",
    padding: "12px 25px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default Home;
