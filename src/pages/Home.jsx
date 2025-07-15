import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import PageLayout from "../Components/PageLayout";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [filterText, setFilterText] = useState("");
  const [overdueTasks, setOverdueTasks] = useState([]);
  const navigate = useNavigate();

  const toastId = "overdue-warning";

  useEffect(() => {
    // Tüm görevleri çek
    fetch("https://localhost:44314/api/Gorevler/ListTask")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => {
        console.error("Görevleri çekerken hata:", err);
        toast.error("Görevler yüklenirken hata oluştu");
      });

    // Geç kalan görevleri çek ve uyarı göster (sadece 1 kere)
    fetch("https://localhost:44314/api/Gorevler/overdue")
      .then(res => res.json())
      .then((overdue) => {
        setOverdueTasks(overdue);
        if (overdue.length > 0 && !toast.isActive(toastId)) {
          toast.warn(`${overdue.length} adet görev süresi geçti!`, {
            toastId,
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            onClick: () => {
              setFilterText("__showOverdue__"); // Filtreyi geç kalanlara ayarla
            },
          });
        }
      })
      .catch(err => {
        console.error("Geç kalan görevleri alırken hata:", err);
      });
  }, []);

  const notifySuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
    });

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  const handleAddTask = () => {
    if (!newTaskText.trim() || !newTaskDate) {
      notifyError("Lütfen görev ve tarih giriniz!");
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
        notifySuccess("Görev başarıyla eklendi.");
      })
      .catch((err) => {
        console.error("Görev ekleme hatası:", err);
        notifyError("Görev eklenemedi.");
      });
  };

  const handleToggleDone = (task) => {
    const updatedTask = { ...task, completed: !task.completed };

    fetch("https://localhost:44314/api/Gorevler/UpdateTask", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        notifySuccess("Görev durumu güncellendi.");
      })
      .catch((err) => {
        console.error("Güncelleme hatası:", err);
        notifyError("Görev durumu güncellenemedi.");
      });
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
        notifySuccess("Görev güncellendi.");
      })
      .catch((err) => {
        console.error("Kaydetme hatası:", err);
        notifyError("Görev güncellenemedi.");
      });
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
        notifyError("Görev silinemedi.");
      });
  };

  // Filtreleme mantığı:
  const filteredTasks = tasks.filter((t) => {
    if (filterText === "__showOverdue__") {
      return !t.completed && new Date(t.date) < new Date();
    } else {
      return t.text.toLowerCase().includes(filterText.toLowerCase());
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <PageLayout>
      <Header title="Yapılacaklar Listesi" />
      <div style={styles.container}>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleAddTask} style={styles.addButton}>
              Ekle
            </button>
          </div>

          <h3 style={styles.subtitle}>Görevleri Filtrele</h3>
          <input
            type="text"
            placeholder={
              filterText === "__showOverdue__"
                ? "Geç kalan görevler gösteriliyor"
                : "Görev ara..."
            }
            value={filterText === "__showOverdue__" ? "" : filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={styles.input}
          />

          <h3 style={styles.subtitle}>Görev Listesi</h3>
          {filteredTasks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Görev bulunamadı.
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
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    style={task.completed ? styles.completedRow : null}
                  >
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
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                            color: task.completed ? "#999" : "#222",
                            fontWeight: "500",
                          }}
                        >
                          {task.text}
                        </span>
                      )}
                    </td>
                    <td>{formatDate(task.date)}</td>
                    <td>
                      {editId === task.id ? (
                        <button
                          onClick={handleSaveClick}
                          style={styles.saveButton}
                        >
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

          <button
            onClick={() => navigate("/tamamlananlar")}
            style={styles.navButton}
          >
            Tamamlanan Görevler Sayfasına Git
          </button>
        </div>
      </div>
      <ToastContainer />
    </PageLayout>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  container: {
    maxWidth: "1100px",
    width: "100%",
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    fontWeight: "700",
    color: "#1976d2",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginTop: "40px",
    marginBottom: "15px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
  },
  editInput: {
    width: "100%",
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  addButton: {
    padding: "12px 28px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: "16px",
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
  },
};

export default Home;
