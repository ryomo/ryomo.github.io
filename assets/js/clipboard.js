document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre").forEach(addCopyButton);
});

function addCopyButton(pre) {
  const button = document.createElement("button");
  button.innerText = "📋";
  button.className = "copy-button";

  pre.insertAdjacentElement("afterend", button);

  button.addEventListener("click", function () {
    const code = pre.querySelector("code");
    if (!code) {
      return;
    }
    navigator.clipboard.writeText(code.innerText).then(() => {
      button.innerText = "✅Copied!";
      setTimeout(() => (button.innerText = "📋"), 2000);
    });
  });
}
