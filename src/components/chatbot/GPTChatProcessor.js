

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const processMessageToChatGPT = async (chatMessages, systemContent, appendAndPost) => {
    
  const apiMessages = chatMessages.map(({ sender, message }) => ({
    role: sender === "gipity" ? "assistant" : "user",
    content: message
  }));

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    messages: [
      { role: "system", content: systemContent },
      ...apiMessages
    ]
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(apiRequestBody)
  });

  const data = await response.json();
  const assistantContent = data.choices[0].message.content;
  const assistantMessage = {
    message: assistantContent,
    sender: "gipity",
    direction: "incoming",
    position: "single"
  };

  return appendAndPost ? assistantMessage : assistantContent;
}