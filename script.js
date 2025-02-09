let messages = JSON.parse(localStorage.getItem('chatHistory')) || [];

document.addEventListener("DOMContentLoaded", () => {
    displayMessages();
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
});

function displayMessages() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    messages.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add(msg.role === "user" ? "user-message" : "ai-message");
        div.textContent = `${msg.role === "user" ? "ADMIN" : "GERD"}: ${msg.content}`;
        chatBox.appendChild(div);
    });
}

async function sendMessage() {
    const userInputField = document.getElementById("user-input");
    const userMessage = userInputField.value.trim();

    if (!userMessage) return;

    // Add user message
    messages.push({ role: "user", content: userMessage });
    displayMessages();
    userInputField.value = "";

    // Show "GERD is typing..."
    const chatBox = document.getElementById("chat-box");
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing");
    typingIndicator.textContent = "GERD is typing...";
    chatBox.appendChild(typingIndicator);

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages })
        });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        messages = data.messages;
        localStorage.setItem("chatHistory", JSON.stringify(messages));

        // Remove typing indicator and display new messages
        chatBox.removeChild(typingIndicator);
        displayMessages();
    } catch (error) {
        console.error("Error:", error);
        chatBox.removeChild(typingIndicator);
    }
}
