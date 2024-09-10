import { useEffect, useState } from "react";
import { MessageType } from "../../src/types/message-type";
import "./WelcomeComponent.css"; // Import the CSS file

const vscode = window.acquireVsCodeApi();

export const WelcomeComponent = () => {
  const [customEventMessage, setCustomEventMessage] = useState();
  const handleLoginBtn = (type) => {
    vscode.postMessage({
      type,
    });
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      if (message.type === "customEvent") {
        setCustomEventMessage(message.value);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="container">
      <h1 className="heading">Welcome to Serpent Boost!</h1>
      <p className="paragraph">Boost your productivity with our extension.</p>
      {!customEventMessage && (
        <button
          className="button"
          onClick={() => handleLoginBtn(MessageType.LOGIN_REGISTER)}
        >
          Login/Register
        </button>
      )}
    </div>
  );
};
