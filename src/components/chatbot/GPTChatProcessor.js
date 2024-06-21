

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const processMessageToChatGPT = async (chatMessages, systemContent, appendAndPost) => {
    
  let apiMessages = chatMessages.map((messageObject) => {
    let role = "";
    if (messageObject.sender === "gipity") {
      role = "assistant";
    } else {
      role = "user";
    }
    return { role: role, content: messageObject.message }
  });

  const systemMessage = {
    role: "system",
    content: systemContent
  };

  const apiRequestBody = {
    "model": "gpt-3.5-turbo",
    "messages": [
      systemMessage,  
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
  const assistantMessage = {
    message: data.choices[0].message.content,
    sender: "gipity",
    direction: "incoming",
    position: "single"
  };

  if (appendAndPost) {
    return assistantMessage;
  } else {
    return data.choices[0].message.content;
  }
}