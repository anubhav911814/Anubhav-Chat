async function sendMessage(text) {
    const cleanText = text.trim();

    if (!cleanText) return;

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

    // Clear input and update interface
    input.value = "";
    input.style.height = "auto";

    renderHistory();
    renderMessages();

    // Show loading message
    const loadingRow = document.createElement("div");
    loadingRow.className = "message-row";

    const loadingContent = document.createElement("div");
    loadingContent.className = "message-content";
    loadingContent.textContent = "Anubhav Chat is thinking...";

    loadingRow.appendChild(loadingContent);
    messages.appendChild(loadingRow);
    messages.scrollTop = messages.scrollHeight;

    try {
        // Connect to Cloudflare backend
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: cleanText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API request failed");
        }

        if (typeof data.reply !== "string" || !data.reply.trim()) {
            throw new Error("Empty response received from AI");
        }

        // Save real AI response
        currentConversation.messages.push({
            role: "assistant",
            text: data.reply
        });

    } catch (error) {
        console.error("Anubhav Chat API Error:", error);

        currentConversation.messages.push({
            role: "assistant",
            text: "Sorry, AI response nahi aa paya. Please try again. Error: " + error.message
        });

    } finally {
        renderHistory();
        renderMessages();
        input.focus();
    }
}