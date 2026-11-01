// ========================================
// ANUBHAV CHAT - JAVASCRIPT
// ========================================

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messages = document.getElementById("chat-messages");
const welcome = document.getElementById("welcome");
const newChatButton = document.getElementById("new-chat");
const historyBox = document.getElementById("chat-history");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");

let conversations = [];
let currentConversation = null;


// ========================================
// CREATE NEW CHAT
// ========================================

function createConversation() {
    currentConversation = {
        title: "New Chat",
        messages: []
    };

    conversations.unshift(currentConversation);

    renderHistory();
    renderMessages();

    input.focus();
}


// ========================================
// DISPLAY CHAT HISTORY
// ========================================

function renderHistory() {
    historyBox.innerHTML = "";

    if (conversations.length === 0) {
        const empty = document.createElement("p");

        empty.className = "history-empty";
        empty.textContent = "No conversations yet";

        historyBox.appendChild(empty);
        return;
    }

    conversations.forEach((conversation) => {
        const item = document.createElement("div");

        item.className = "history-item";
        item.textContent = conversation.title;

        if (conversation === currentConversation) {
            item.classList.add("active");
        }

        item.addEventListener("click", () => {
            currentConversation = conversation;

            renderHistory();
            renderMessages();

            sidebar.classList.remove("open");
        });

        historyBox.appendChild(item);
    });
}


// ========================================
// DISPLAY MESSAGES
// ========================================

function renderMessages() {
    messages.innerHTML = "";

    if (
        !currentConversation ||
        currentConversation.messages.length === 0
    ) {
        welcome.style.display = "block";
        messages.appendChild(welcome);
        return;
    }

    welcome.style.display = "none";

    currentConversation.messages.forEach((message) => {
        addMessageToScreen(message.role, message.text);
    });
}


// ========================================
// ADD MESSAGE TO SCREEN
// ========================================

function addMessageToScreen(role, text) {
    const row = document.createElement("div");

    row.className = "message-row";

    if (role === "user") {
        const bubble = document.createElement("div");

        bubble.className = "user-message";
        bubble.textContent = text;

        row.appendChild(bubble);
    } else {
        const avatar = document.createElement("div");

        avatar.className = "avatar";
        avatar.textContent = "✦";

        const content = document.createElement("div");

        content.className = "message-content";

        const label = document.createElement("div");

        label.className = "bot-label";
        label.textContent = "Anubhav Chat";

        const response = document.createElement("div");

        response.textContent = text;

        content.appendChild(label);
        content.appendChild(response);

        row.appendChild(avatar);
        row.appendChild(content);
    }

    messages.appendChild(row);

    messages.scrollTop = messages.scrollHeight;
}


// ========================================
// DEMO AI REPLIES
// ========================================

function getDemoReply(text) {
    const message = text.toLowerCase().trim();

    if (
        message === "hello" ||
        message === "hi" ||
        message === "hey"
    ) {
        return "Hello! 👋 Welcome to Anubhav Chat. How can I help you today?";
    }

    if (
        message.includes("your name") ||
        message.includes("who are you")
    ) {
        return "I am Anubhav Chat, your personal chat assistant demo.";
    }

    if (message.includes("html")) {
        return "HTML creates the structure of a website. CSS styles it, and JavaScript makes it interactive.";
    }

    if (message.includes("css")) {
        return "CSS controls website colors, layouts, spacing, animations, and responsive design.";
    }

    if (message.includes("javascript")) {
        return "JavaScript makes websites interactive, including buttons, forms, and chat interfaces.";
    }

    if (message.includes("help")) {
        return "Of course! Tell me what you need help with, and I will try to guide you.";
    }

    if (message.includes("thank")) {
        return "You're welcome! 😊 Let me know if you need anything else.";
    }

    return "I received your message! Anubhav Chat is currently running in demo mode. A backend and AI API are required for real AI-generated answers.";
}


// ========================================
// SEND MESSAGE
// ========================================

function sendMessage(text) {
    const cleanText = text.trim();

    if (!cleanText) {
        return;
    }

    if (!currentConversation) {
        createConversation();
    }

    if (currentConversation.messages.length === 0) {
        currentConversation.title =
            cleanText.length > 28
                ? cleanText.substring(0, 28) + "..."
                : cleanText;
    }

    // Save user message
    currentConversation.messages.push({
        role: "user",
        text: cleanText
    });

    // Generate demo reply
    const reply = getDemoReply(cleanText);

    // Save assistant message
    currentConversation.messages.push({
        role: "assistant",
        text: reply
    });

    // Clear input
    input.value = "";
    input.style.height = "auto";

    // Update interface
    renderHistory();
    renderMessages();

    input.focus();
}


// ========================================
// FORM SUBMISSION
// ========================================

if (form && input && messages) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        sendMessage(input.value);
    });
} else {
    console.error(
        "Anubhav Chat: Required HTML elements were not found. Check the IDs in index.html."
    );
}


// ========================================
// NEW CHAT BUTTON
// ========================================

if (newChatButton) {
    newChatButton.addEventListener("click", function () {
        createConversation();

        if (sidebar) {
            sidebar.classList.remove("open");
        }
    });
}


// ========================================
// MOBILE SIDEBAR
// ========================================

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });
}


// ========================================
// AUTO-RESIZE TEXTAREA
// ========================================

if (input) {
    input.addEventListener("input", function () {
        input.style.height = "auto";

        input.style.height =
            Math.min(input.scrollHeight, 150) + "px";
    });
}


// ========================================
// SUGGESTION BUTTONS
// ========================================

document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", function () {
        const prompt = button.dataset.prompt;

        sendMessage(prompt);
    });
});


// ========================================
// START APPLICATION
// ========================================

createConversation();

console.log("Anubhav Chat JavaScript loaded successfully!");