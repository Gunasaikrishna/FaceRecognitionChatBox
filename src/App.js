import React, { useState } from "react";
import ChatAI from "./ChatAI";
import FaceRegister from "./FaceRegister";
import FaceLogin from "./FaceLogin";

function App() {
  const [stage, setStage] = useState("register"); // Options: register, login, chat

  const handleGoToLogin = () => {
    setStage("login");
  };

  const handleRegistered = () => {
    setStage("login");
  };

  const handleAuthenticated = () => {
    setStage("chat");
  };

  return (
    <>
      {stage === "register" && (
        <FaceRegister
          onRegistered={handleRegistered}
          goToLogin={handleGoToLogin}
        />
      )}

      {stage === "login" && (
        <FaceLogin onAuthenticated={handleAuthenticated} />
      )}

      {stage === "chat" && <ChatAI />}
    </>
  );
}

export default App;
