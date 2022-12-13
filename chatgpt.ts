const dotenv = require("dotenv");
dotenv.config();
export async function getResponse(prompt : string) {
  const response = await fetch(
    "https://chat.openai.com/backend-api/conversation",
    {
      headers: {
        accept: "text/event-stream",
        "content-type": "application/json",
        "User-Agent": "",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        "x-openai-assistant-app-id": "",
      },
      body: JSON.stringify({
        action: "next",
        messages: [
          {
            id: "",
            role: "user",
            content: { content_type: "text", parts: { prompt } },
          },
        ],
        parent_message_id: "",
        model: "text-davinci-002-render",
      }),
      method: "POST",
    }
  );
  const stream = response.body
  const reader = stream.getReader()
  await readEvents(reader)
}

const decoder = new TextDecoder()

async function readEvents(reader : ReadableStreamDefaultReader<Uint8Array>) {
  const result = await reader.read()
  if (result.done) return

  const event = result.value
  console.log(decoder.decode(event))

  await readEvents(reader)
}