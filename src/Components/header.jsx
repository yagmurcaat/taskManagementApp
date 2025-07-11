function Header({ title }) {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    textAlign: "center",
    width: "100%",
    maxWidth: "1000px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    margin: 0,
    fontSize: "28px",
  },
};

export default Header;
