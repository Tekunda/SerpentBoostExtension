document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");

  const vscode = acquireVsCodeApi();
  console.log("vscode API acquired");

  let showBtn = false;

  const handleLoginBtn = (type) => {
    vscode.postMessage({
      type,
    });
  };

  const handleMessage = (event) => {
    console.log("Message type", event?.data.type);
    const type = event?.data.type;
    if (type === "DISABLE_BTN") {
      showBtn = false;
    }
    if (type === "ENABLE_BTN") {
      showBtn = true;
    }
    updateUI();
  };

  window.addEventListener("message", handleMessage);

  const updateUI = () => {
    console.log("Updating UI");
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
