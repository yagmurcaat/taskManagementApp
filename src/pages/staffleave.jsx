import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import PageLayout from "../Components/PageLayout";
import { Pagination } from "@mui/material";

function staffleave() {
  const [leaves, setLeaves] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    fetchLeaves();
    fetchEmployees(); 
  }, []);

  const fetchEmployees = () => {
  fetch("https://localhost:44314/api/Employee/list")
    .then((res) => res.json())
     .then((data) => {
      console.log("Gelen personeller:", data); // 👈 BURADA!
      setEmployees(data);
    })
    .catch((err) => console.error("Personel listesi alınamadı:", err));
};

  const fetchLeaves = () => {
    fetch("https://localhost:44314/api/Staffleave/listleave")
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((err) => console.error(err));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // sadece harfler ve boşluk kabul edilir (Türkçe karakterler dahil)
    const filtered = value.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");
    setName(filtered);
  };

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

const handleAddLeave = () => {
  if (!name.trim() || !startDate || !endDate || !leaveType) return;

  // 🔍 Personel kontrolü
  const matchedEmployee = employees.find(
    (emp) => emp.username?.toLowerCase() === name.trim().toLowerCase()
  );

  if (!matchedEmployee) {
    showToast("error", "Bu isimde bir personel bulunamadı.");
    return;
  }

  // 🔄 Tarih kontrolü
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    alert("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
    return;
  }

  // 👇 Devam: izin objesi oluştur
  const newLeave = {
    Isim: name,
    BaslangicTarihi: startDate,
    BitisTarihi: endDate,
    IzinTuru: leaveType,
  };

    fetch("https://localhost:44314/api/StaffLeave/Addleave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeave),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ekleme başarısız.");
        return fetch("https://localhost:44314/api/StaffLeave/listleave");
      })
      .then((res) => res.json())
      .then((data) => {
        setLeaves(data);
        setName("");
        setStartDate("");
        setEndDate("");
        setLeaveType("");
        showToast("success", "Personel izni başarıyla eklendi.");
        setPage(1);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Ekleme işlemi başarısız oldu.");
      });
  };

  const handleDeleteLeave = (id) => {
    fetch(`https://localhost:44314/api/StaffLeave/DeleteLeave/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Silme başarısız.");
        return fetch("https://localhost:44314/api/StaffLeave/listleave");
      })
      .then((res) => res.json())
      .then((data) => {
        setLeaves(data);
        showToast("success", "Personel izni başarıyla silindi.");
        const maxPage = Math.ceil(data.length / itemsPerPage);
        if (page > maxPage) setPage(maxPage);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Silme işlemi başarısız oldu.");
      });
  };

  // paginate leaves
  const pagedLeaves = leaves.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(leaves.length / itemsPerPage);

  return (
    <PageLayout>
      <div style={styles.container}>
        <Header title="Personel İzinleri" />
        <div style={styles.inner}>
          <h2 style={styles.title}>İzin Ekle</h2>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="İsim Soyisim giriniz..."
              value={name}
              onChange={handleNameChange}
              style={styles.input}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
            />
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={styles.input}
            >
              <option value="">İzin Türü Seçiniz</option>
              <option value="Yıllık İzin">Yıllık İzin</option>
              <option value="Hastalık İzni">Hastalık İzni</option>
              <option value="Ücretsiz İzin">Ücretsiz İzin</option>
              <option value="Diğer">Diğer</option>
            </select>
            <button onClick={handleAddLeave} style={styles.addButton}>
              Ekle
            </button>
          </div>

          <h3 style={styles.subtitle}>İzin Listesi</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>İsim Soyisim</th>
                <th style={styles.th}>Tarih Aralığı</th>
                <th style={styles.th}>İzin Türü</th>
                <th style={styles.th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {pagedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                    Henüz izin girilmedi.
                  </td>
                </tr>
              ) : (
                pagedLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td style={styles.td}>{leave.isim}</td>
                    <td style={styles.td}>
                      {new Date(leave.baslangicTarihi).toLocaleDateString()} -{" "}
                      {new Date(leave.bitisTarihi).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{leave.izinTuru}</td>
                    <td style={styles.td}>
                      <IconButton
                        onClick={() => handleDeleteLeave(leave.id)}
                        color="error"
                        size="large"
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  inner: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    padding: "40px",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f2f5",
    color: "#333",
    minWidth: "200px",
    boxSizing: "border-box",
  },
  addButton: {
    padding: "14px 28px",
    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  subtitle: {
    textAlign: "left",
    fontSize: "18px",
    fontWeight: "600",
    margin: "30px 0 10px",
    color: "#34495e",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#1976d2",
    color: "#fff",
    borderRadius: "8px 8px 0 0",
  },
  td: {
    backgroundColor: "#fff",
    padding: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderRadius: "6px",
  },
};

export default staffleave;
