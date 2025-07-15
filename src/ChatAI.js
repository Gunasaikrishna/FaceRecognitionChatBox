import React, { useState, useRef } from "react";

const ChatAI = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const recognitionRef = useRef(null);

  const apiUrl = "http://localhost:8000/askChat";

  const sendQuestion = async (question) => {
    if (!question) return;
    setLoading(true); // ✅ Start loading
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setChat((prev) => [...prev, { question, answer: data.answer }]);
    } catch (error) {
      console.error("API error:", error);
      setChat((prev) => [
        ...prev,
        { question, answer: "Error: Could not get response" },
      ]);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    sendQuestion(input.trim());
    setInput("");
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      sendQuestion(spokenText);
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(to bottom, #e0f7fa, #ffffff)",
      }}
    >
      <p
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: 20,
          color: "#0077b6",
        }}
      >
        Ask Something... Helps You 😁👍
      </p>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: 30,
          overflowY: "auto",
          borderBottom: "2px solid #b2ebf2",
        }}
      >
        {chat.map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: 8,
                color: "#00796b",
                fontSize: 16,
              }}
            >
              Q: {item.question}
            </div>
            <div
              style={{
                backgroundColor: "#f1f8e9",
                padding: 14,
                borderRadius: 10,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                whiteSpace: "pre-wrap",
                fontSize: 15,
                color: "#333",
              }}
            >
              A: {item.answer}
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
            <span>⏳ Loading...</span>
          </div>
        )}
      </div>

      {/* Input and Buttons */}
      <div
        style={{
          display: "flex",
          padding: 20,
          borderTop: "2px solid #b2ebf2",
          backgroundColor: "#ffffff",
        }}
      >
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendText();
            }
          }}
          style={{
            flex: 1,
            padding: "12px 18px",
            fontSize: 16,
            border: "2px solid #81d4fa",
            borderRadius: 25,
            outline: "none",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            transition: "0.3s ease",
          }}
        />

        <button
          onClick={handleSendText}
          disabled={loading}
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: loading ? "#b0bec5" : "#0288d1",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
        >
          OK
        </button>

        <button
          onClick={startVoiceRecognition}
          disabled={loading}
          title="Speak"
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            fontSize: 18,
            backgroundColor: "#26a69a",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatAI;
