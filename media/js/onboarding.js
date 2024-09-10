document.addEventListener("DOMContentLoaded", function () {
  const vscode = acquireVsCodeApi();

  let showBtn = false;

  const handleLoginBtn = (type) => {
    vscode.postMessage({
      type,
    });
  };

  const handleMessage = (event) => {
    const type = event?.data.type;
    switch (type) {
      case "DISABLE_BTN":
        showBtn = false;
        break;
      case "ENABLE_BTN":
        showBtn = true;
        break;
      default:
        console.log("Unknown message type", type);
        break;
    }
    updateUI();
  };

  window.addEventListener("message", handleMessage);

  const updateUI = () => {
    const container = document.querySelector(".container");
    if (!container) {
      console.error("Container element not found");
      return;
    }
    container.innerHTML = `
        <h1 class="heading">Welcome to Serpent Boost!</h1>
        <p class="paragraph">Boost your productivity with our extension.</p>
        ${
          showBtn
            ? `<button class="button" id="loginBtn">Login/Register</button>`
            : ""
        }
      `;

    if (showBtn) {
      document
        .getElementById("loginBtn")
        .addEventListener("click", () => handleLoginBtn("LOGIN_REGISTER"));
    }
  };

  updateUI();
});
