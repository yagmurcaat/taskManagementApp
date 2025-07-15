import React from "react";

const layoutStyles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
  },
};

function PageLayout({ children }) {
  return (
    <div style={layoutStyles.wrapper}>
      <div style={layoutStyles.container}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
