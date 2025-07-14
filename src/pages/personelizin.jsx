import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from 'sweetalert2';

function PersonelIzin() {
  const [izinler, setIzinler] = useState([]);
  const [isim, setIsim] = useState("");
  const [baslangicTarihi, setBaslangicTarihi] = useState("");
  const [bitisTarihi, setBitisTarihi] = useState("");

  useEffect(() => {
    fetch("https://localhost:44314/api/personelizin/listleave")
      .then((res) => res.json())
      .then((data) => setIzinler(data))
      .catch((err) => console.error(err));
  }, []);

  // Sadece harf ve boşluk kabul eden isim input handler
  const handleIsimChange = (e) => {
    const value = e.target.value;
    const filtered = value.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");
    setIsim(filtered);
  };

  const handleAddIzin = () => {
  if (isim.trim() === "" || baslangicTarihi === "" || bitisTarihi === "") return;

  const baslangic = new Date(baslangicTarihi);
  const bitis = new Date(bitisTarihi);
  if (bitis <= baslangic) {
    alert("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
    return;
  }

  const yeniIzin = {
    isim,
    baslangicTarihi,
    bitisTarihi,
  };

  fetch("https://localhost:44314/api/personelizin/Addleave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(yeniIzin),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Ekleme başarısız.");
      return fetch("https://localhost:44314/api/personelizin/listleave");
    })
    .then((res) => res.json())
    .then((data) => {
      setIzinler(data);
      setIsim("");
      setBaslangicTarihi("");
      setBitisTarihi("");

      // ✅ Ekleme sonrası başarılı mesajı
      Swal.fire({
        icon: 'success',
        title: 'Eklendi!',
        text: 'Personel izni başarıyla eklendi.',
        confirmButtonColor: '#3085d6',
      });
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Ekleme işlemi başarısız oldu.',
        confirmButtonColor: '#d33',
      });
    });
};


  const handleDeleteIzin = (id) => {
    fetch(`https://localhost:44314/api/personelizin/DeleteLeave/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Silme başarısız.");
        return fetch("https://localhost:44314/api/personelizin/listleave");
      })
      .then((res) => res.json())
      .then((data) => {
        setIzinler(data);
        Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'Personel izni başarıyla silindi.',
          confirmButtonColor: '#3085d6',
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Silme işlemi başarısız oldu.',
          confirmButtonColor: '#d33',
        });
      });
  };

  return (
    <>
      <div style={styles.container}>
        <Header title="Personel İzin" />
        <div style={styles.box}>
          <h2 style={styles.title}>Personel İzin</h2>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="İsim Soyisim giriniz..."
              value={isim}
              onChange={handleIsimChange}
              style={styles.input}
            />
            <input
              type="date"
              value={baslangicTarihi}
              onChange={(e) => setBaslangicTarihi(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={bitisTarihi}
              onChange={(e) => setBitisTarihi(e.target.value)}
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
                <th style={styles.th}>Tarih Aralığı</th>
                <th style={styles.th}></th>
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
                    <td style={styles.td}>
                      {new Date(i.baslangicTarihi).toLocaleDateString()} -{" "}
                      {new Date(i.bitisTarihi).toLocaleDateString()}
                    </td>
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
    margin: "5px auto",
    backgroundColor: "#f2f5f7",
    paddingBottom: "150px",
    paddingLeft: "250px",
    paddingRight: "320px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  box: {
    padding: "100px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "center",
  },
  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#A9A9A9",
    color: "#000",
    width: "220px",
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
