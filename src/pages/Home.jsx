import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import PageLayout from "../Components/PageLayout";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from "@mui/material";

const MAX_TEXT_LENGTH = 50;

const truncateText = (text, maxLength = MAX_TEXT_LENGTH) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("orta");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [filterText, setFilterText] = useState("");
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const toastId = "overdue-warning";
  const tasksPerPage = 7;

  useEffect(() => {
    fetch("https://localhost:44314/api/Gorevler/ListTask")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error("Görevleri çekerken hata:", err);
        toast.error("Görevler yüklenirken hata oluştu");
      });

    fetch("https://localhost:44314/api/Gorevler/overdue")
      .then((res) => res.json())
      .then((overdue) => {
        setOverdueTasks(overdue);
        if (overdue.length > 0 && !toast.isActive(toastId)) {
          toast.warn(`${overdue.length} adet görev süresi geçti!`, {
            toastId,
            position: "top-right",
            autoClose: 4000,
            onClick: () => {
              setFilterText("__showOverdue__");
            },
          });
        }
      })
      .catch((err) => {
        console.error("Geç kalan görevleri alırken hata:", err);
      });
  }, []);

  const notifySuccess = (msg) =>
    toast.success(msg, { autoClose: 2000, theme: "colored" });

  const notifyError = (msg) =>
    toast.error(msg, { autoClose: 2500, theme: "colored" });

 const handleAddTask = async () => {
  if (!newTaskText.trim() || !newTaskDate) {
    notifyError("Lütfen görev ve tarih giriniz!");
    return;
  }

  const newTask = {
    Text: newTaskText,
    Date: newTaskDate,
    Oncelik: newTaskPriority,
    Completed: false, // boolean olarak
  };

  try {
    const response = await fetch("https://localhost:44314/api/Gorevler/AddTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.title || (await response.text()) || "Bilinmeyen hata";
      throw new Error(errorMessage);
    }

    const data = await response.json();

    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskPriority("orta");
    notifySuccess("Görev başarıyla eklendi");
    setPage(1);
    setTasks(data);
  } catch (err) {
    console.error("Görev eklenemedi:", err);
    notifyError("Görev eklenemedi: " + err.message);
  }
};


  const handleToggleDone = (task) => {
    const updatedTask = {
      Id: task.id,
      Text: task.text,
      Date: task.date,
      Oncelik: task.oncelik,
      Completed: !task.completed,
    };

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
      Id: editId,
      Text: editText,
      Date: editDate,
      Completed: tasks.find((t) => t.id === editId)?.completed || false,
      Oncelik: tasks.find((t) => t.id === editId)?.oncelik || "orta",
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
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setTasks(data);
        Swal.fire({
          icon: "success",
          title: "Silindi!",
          text: "Görev başarıyla silindi.",
        });
      } else {
        notifyError("Görev silinemedi, sunucu yanıtı beklenmedik.");
      }
    })
    .catch((err) => {
      console.error("Silme hatası:", err);
      notifyError("Görev silinemedi.");
    });
};


  const filteredTasks = tasks.filter((t) => {
    const isOverdue =
      filterText === "__showOverdue__"
        ? !t.completed && new Date(t.date) < new Date()
        : true;

    const matchesText =
      filterText === "__showOverdue__"
        ? true
        : t.text.toLowerCase().includes(filterText.toLowerCase());

    const matchesPriority = priorityFilter ? t.oncelik === priorityFilter : true;

    return isOverdue && matchesText && matchesPriority;
  });

  const pageCount = Math.ceil(filteredTasks.length / tasksPerPage);

  const pagedTasks = filteredTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.split("T")[0]);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <PageLayout>
      <ToastContainer />
      <Header title="Yapılacaklar Listesi" />
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Yeni Görev Ekle</h2>
          <div style={styles.flexRow}>
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
              min={new Date().toISOString().split("T")[0]}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              style={styles.select}
            >
              <option value="kritik">Kritik</option>
              <option value="orta">Orta</option>
              <option value="dusuk">Düşük</option>
            </select>
            <button onClick={handleAddTask} style={styles.addButton}>
              Ekle
            </button>
          </div>

          <h3 style={styles.subtitle}>Görevleri Filtrele</h3>
          <div style={styles.filterContainer}>
            <input
              type="text"
              placeholder={
                filterText === "__showOverdue__"
                  ? "Geç kalan görevler gösteriliyor"
                  : "Görev ara..."
              }
              value={filterText === "__showOverdue__" ? "" : filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={styles.filterInput}
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">Tüm Öncelikler</option>
              <option value="kritik">Kritik</option>
              <option value="orta">Orta</option>
              <option value="dusuk">Düşük</option>
            </select>
          </div>

          <h3 style={styles.subtitle}>Görev Listesi</h3>
          {pagedTasks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Görev bulunamadı.
            </p>
          ) : (
            <>
              <table style={styles.table}>
              <thead>
  <tr>
    <th style={styles.tableHeader}></th>
    <th style={styles.tableHeader}>Görev</th>
    <th style={styles.tableHeader}>Tarih</th>
    <th style={styles.tableHeader}>Öncelik</th>
    <th style={styles.tableHeader}>İşlemler</th>
  </tr>
</thead>
<tbody>
  {pagedTasks.map((task) => (
    <tr
      key={task.id}
      style={task.completed ? styles.completedRow : undefined}
    >
      <td style={styles.tableCell}>
        <Checkbox
          checked={task.completed}
          onChange={() => handleToggleDone(task)}
          color="primary"
        />
      </td>

      <td style={styles.tableCell}>
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
              style={{ ...styles.editInput, marginTop: 8 }}
              min={new Date().toISOString().split("T")[0]}
            />
          </>
        ) : (
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTask(task)}
          >
            {truncateText(task.text)}
          </span>
        )}
      </td>

      <td style={styles.tableCell}>{formatDate(task.date)}</td>

      <td style={styles.tableCell}>
        <span
          style={{
            color:
              task.oncelik === "kritik"
                ? "red"
                : task.oncelik === "orta"
                ? "orange"
                : "green",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {task.oncelik}
        </span>
      </td>

      <td style={styles.tableCell}>
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
              onClick={() => handleEditClick(task.id, task.text, task.date)}
              style={styles.fab}
            >
              <EditIcon />
            </Fab>
            <IconButton
              onClick={() => handleDeleteTask(task.id)}
              color="error"
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
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
                color="primary"
              />
            </>
          )}

          {/* Görev Detay Modal */}
          <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 8,
                maxWidth: 400,
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 0 10px rgba(0,0,0,0.25)",
                outline: "none",
              }}
            >
              {selectedTask && (
                <>
                  <h2>Görev Detayları</h2>
                  <p>
                    <strong>Görev:</strong> {selectedTask.text}
                  </p>
                  <p>
                    <strong>Tarih:</strong> {formatDate(selectedTask.date)}
                  </p>
                  <p>
                    <strong>Öncelik:</strong>{" "}
                    <span
                      style={{
                        color:
                          selectedTask.oncelik === "kritik"
                            ? "red"
                            : selectedTask.oncelik === "orta"
                            ? "orange"
                            : "green",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedTask.oncelik}
                    </span>
                  </p>

                  <button
                    onClick={() => setSelectedTask(null)}
                    style={{ marginTop: 15 }}
                  >
                    Kapat
                  </button>
                </>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </PageLayout>
  );
}

const styles = {
    tableCell: {
    padding: "10px 16px",
    verticalAlign: "middle",
    textAlign: "center",
    maxWidth: "200px",
    wordWrap: "break-word",
  },
  tableHeader: {
    textAlign: "center",
    padding: "10px 16px",
    fontWeight: "bold",
    color: "#444",
  },

  container: { maxWidth: 1100, width: "100%", margin: "0 auto" },
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.07)",
  },

  title: {
    fontSize: "1.8rem",
    marginBottom: 20,
    fontWeight: "700",
    color: "#1976d2",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginTop: 40,
    marginBottom: 15,
    fontWeight: "600",
    color: "#555",
  },
  flexRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: "14px 20px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
  },
  select: {
    flex: 1,
    padding: "14px 20px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
    cursor: "pointer",
  },
  addButton: {
    padding: "12px 28px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 16,
    minWidth: 100,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: 16,
    marginTop: 20,
  },
  completedRow: { backgroundColor: "#f0f4f8", color: "#999" },
  editInput: {
    width: "100%",
    padding: "12px 18px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 10,
  },
  fab: { marginRight: 10, width: 36, height: 36 },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#388e3c",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
  },
  filterContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    maxWidth: "400px",
  },
  filterInput: {
    flex: 1,
    padding: "14px 20px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
    boxSizing: "border-box",
  },
  filterSelect: {
    flexBasis: "140px",
    padding: "14px 20px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    backgroundColor: "#f6f8fa",
    cursor: "pointer",
    boxSizing: "border-box",
  },
};

export default Home;
