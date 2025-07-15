import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const FaceLogin = ({ onAuthenticated }) => {
  const webcamRef = useRef();
  const [status, setStatus] = useState("Initializing...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus("Ready. Look at the camera and click Login.");
  }, []);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleLogin = async () => {
    setLoading(true);
    setStatus("Capturing image...");

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setStatus("❌ Failed to capture image.");
      setLoading(false);
      return;
    }

    const file = dataURLtoFile(screenshot, "face-login.jpg");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const userId = "user123"; // Use consistent ID as in registration

      const response = await fetch(`http://localhost:8000/face-login/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        setStatus("✅ " + data.message);
        setTimeout(() => onAuthenticated(), 1500);
      } else {
        setStatus("❌ " + (data.message || "Authentication failed."));
      }
    } catch (error) {
      setStatus("❌ Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(to right, #00c6ff, #0072ff)", // light blue to deep blue
      color: "#fff",
      padding: 20,
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <h2 style={{ marginBottom: 20, fontSize: "2rem", color: "#ffffff" }}>
      Face Login
    </h2>
  
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        color: "#333",
        maxWidth: 380,
        width: "100%",
      }}
    >
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        style={{
          borderRadius: 8,
          marginBottom: 15,
          border: "2px solid #0072ff",
        }}
      />
  
      <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>{status}</p>
  
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : "#0072ff",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "0.3s ease",
          width: "100%",
        }}
      >
        {loading ? "Logging in..." : "Login with Face"}
      </button>
    </div>
  </div>
  
  );
};

export default FaceLogin;
