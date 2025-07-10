import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function PersonelIzin() {
  const [izinler, setIzinler] = useState([]);
  const [isim, setIsim] = useState("");
  const [tarih, setTarih] = useState("");

  useEffect(() => {
    fetch("https://localhost:44314/api/izinler")
      .then((res) => res.json())
      .then((data) => setIzinler(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddIzin = () => {
    if (isim.trim() === "" || tarih === "") return;

    const yeniIzin = {
      id: "00000000-0000-0000-0000-000000000000",
      isim,
      tarih,
    };

    fetch("https://localhost:44314/api/izinler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yeniIzin),
    })
      .then((res) => res.json())
      .then((data) => {
        setIzinler(data);
        setIsim("");
        setTarih("");
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteIzin = (id) => {
    fetch(`https://localhost:44314/api/izinler/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setIzinler(data))
      .catch((err) => console.error(err));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <>
       <Header title="Personel İzin" />
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Personel İzin</h2>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="İsim Soyisim giriniz..."
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleAddIzin} style={styles.button}>
              Ekle
            </button>
          </div>

          <h3 style={styles.subtitle}>İzin Listesi</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>İsim Soyisim</th>
                <th style={styles.th}>Tarih</th>
                <th style={styles.th}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {izinler.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "15px" }}>
                    Henüz izin girilmedi.
                  </td>
                </tr>
              ) : (
                izinler.map((i) => (
                  <tr key={i.id}>
                    <td style={styles.td}>{i.isim}</td>
                    <td style={styles.td}>{formatDate(i.tarih)}</td>
                    <td style={styles.td}>
                      <IconButton
                        onClick={() => handleDeleteIzin(i.id)}
                        color="error"
                        size="large"
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: "#f2f5f7",
    minHeight: "100vh",
    paddingTop: "40px",
  },
  box: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "900px",
    margin: "auto",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "250px",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  subtitle: { textAlign: "center", marginBottom: "10px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { backgroundColor: "#1976d2", color: "white", padding: "10px" },
  td: { border: "1px solid #ddd", padding: "10px" },
};

export default PersonelIzin;
