import React, { useState, useEffect } from "react";
import Header from "../Components/header";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import PageLayout from "../Components/PageLayout";

// ... diğer importlar
function PersonelIzin() {
  const [izinler, setIzinler] = useState([]);
  const [isim, setIsim] = useState("");
  const [baslangicTarihi, setBaslangicTarihi] = useState("");
  const [bitisTarihi, setBitisTarihi] = useState("");
  const [izinTuru, setIzinTuru] = useState(""); // zaten vardı

  useEffect(() => {
    fetch("https://localhost:44314/api/personelizin/listleave")
      .then((res) => res.json())
      .then((data) => setIzinler(data))
      .catch((err) => console.error(err));
  }, []);

  const handleIsimChange = (e) => {
    const value = e.target.value;
    const filtered = value.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");
    setIsim(filtered);
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

  const handleAddIzin = () => {
    if (isim.trim() === "" || baslangicTarihi === "" || bitisTarihi === "" || izinTuru === "")
      return;

    const baslangic = new Date(baslangicTarihi);
    const bitis = new Date(bitisTarihi);
    if (bitis <= baslangic) {
      alert("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
      return;
    }

  const yeniIzin = {
  Isim: isim,
  BaslangicTarihi: baslangicTarihi,
  BitisTarihi: bitisTarihi,
  IzinTuru: izinTuru,
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
        setIzinTuru(""); // sıfırla
        showToast("success", "Personel izni başarıyla eklendi.");
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Ekleme işlemi başarısız oldu.");
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
        showToast("success", "Personel izni başarıyla silindi.");
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Silme işlemi başarısız oldu.");
      });
  };

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
            <select
              value={izinTuru}
              onChange={(e) => setIzinTuru(e.target.value)}
              style={styles.input}
            >
              <option value="">İzin Türü Seçiniz</option>
              <option value="Yıllık İzin">Yıllık İzin</option>
              <option value="Hastalık İzni">Hastalık İzni</option>
              <option value="Ücretsiz İzin">Ücretsiz İzin</option>
              <option value="Diğer">Diğer</option>
            </select>
            <button onClick={handleAddIzin} style={styles.addButton}>
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
              {izinler.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
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
                    <td style={styles.td}>{i.izinTuru}</td>
                    <td style={styles.td}>
                      <IconButton
                        onClick={() => handleDeleteIzin(i.id)}
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

export default PersonelIzin;
