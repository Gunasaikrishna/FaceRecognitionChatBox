import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const FaceRegister = ({ onRegistered, goToLogin }) => {
  const webcamRef = useRef();
  const [status, setStatus] = useState("Initializing...");
  const [loading, setLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const userId = "user123"; // You can later fetch this dynamically

  useEffect(() => {
    const checkRegistration = async () => {
      setStatus("Checking registration status...");

      const dummyForm = new FormData();
      // App backend will treat missing face file as 400 or 404
      dummyForm.append("file", new Blob([""], { type: "image/jpeg" }), "empty.jpg");

      try {
        const res = await fetch(`http://localhost:8000/face-login/${userId}`, {
          method: "POST",
          body: dummyForm,
        });

        if (res.status === 404) {
          setAlreadyRegistered(false);
          setStatus("No registration found. Look at the camera and click Register.");
        } else {
          setAlreadyRegistered(true);
          setStatus("Face already registered. Click 'Go to Login'.");
        }
      } catch (error) {
        setStatus("⚠️ Server error while checking registration.");
      }
    };

    checkRegistration();
  }, []);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleRegister = async () => {
    setLoading(true);
    setStatus("Capturing image...");

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setStatus("❌ Failed to capture image.");
      setLoading(false);
      return;
    }

    const file = dataURLtoFile(screenshot, "face-register.jpg");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:8000/face-register/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("✅ " + data.message);
        setTimeout(() => onRegistered(), 1500);
      } else {
        setStatus("❌ " + (data.detail || "Registration failed."));
      }
    } catch (error) {
      setStatus("❌ Network/server error.");
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
      background: "linear-gradient(to right, #6a11cb, #2575fc)", // purple to blue
      color: "#fff",
      padding: 20,
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <h2 style={{ marginBottom: 20, fontSize: "2rem" }}>Face Registration</h2>
  
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        textAlign: "center",
        color: "#333",
      }}
    >
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        style={{ borderRadius: 8, marginBottom: 15 }}
      />
  
      <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>{status}</p>
  
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : "#2575fc",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          marginRight: 10,
          transition: "0.3s",
        }}
      >
        {loading ? "Registering..." : "Register Face"}
      </button>
  
      <button
        onClick={goToLogin}
        style={{
          backgroundColor: "#6a11cb",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 8,
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        Go to Login
      </button>
    </div>
  </div>
  
  );
};

export default FaceRegister;
