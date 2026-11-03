export async function onRequestPost(context) {
  try {
    const { message } = await context.request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message.slice(0, 10000) }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Gemini API request failed." },
        { status: 502 }
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "No reply generated.";

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
