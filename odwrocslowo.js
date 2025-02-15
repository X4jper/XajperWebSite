document.addEventListener("DOMContentLoaded", function() {
    const inputText = document.getElementById("inputText");
    const reverseButton = document.getElementById("reverseButton");
    const outputText = document.getElementById("outputText");
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.classList.add("copy-button");
    outputText.parentNode.appendChild(copyButton);

    reverseButton.addEventListener("click", function() {
        if (inputText.value.trim() === "") return;
        const reversed = inputText.value.split("").reverse().join("");
        outputText.textContent = reversed;
        outputText.classList.add("show");
    });

    copyButton.addEventListener("click", function() {
        if (!outputText.textContent) return;
        navigator.clipboard.writeText(outputText.textContent).then(() => {
            copyButton.classList.add("copied");
            setTimeout(() => copyButton.classList.remove("copied"), 1500);
        });
    });
});


function blokujMysz(event) {
    if (event.button === 2 || event.which === 3) {
        event.preventDefault();
    }
  }
  
function blokujKlawisze(event) {
    if (event.key === 'F12') {
        event.preventDefault();
    }
  
    if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
    }
}

document.addEventListener('mousedown', blokujMysz);

document.addEventListener('keydown', blokujKlawisze);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});