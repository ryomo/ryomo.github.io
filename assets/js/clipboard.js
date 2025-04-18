document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre").forEach(function(pre) {
    // Skip if the grandparent of the "pre" element has the "language-plaintext" class
    if (pre.parentElement?.parentElement?.classList.contains("language-plaintext")) {
      return;
    }
    addCopyButton(pre);
  });
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
