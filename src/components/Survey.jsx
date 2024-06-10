import { processMessageToChatGPT } from './GPTChatProcessor';

export const handleProcessing = async (message, setProcessingNotification, setProcessing, setQuestion, questionRef, handleSend, setProcessingMessage) => {
  setProcessingNotification(false);
  setProcessing(true);
  setQuestion({ ...questionRef.current, message: message });

  const newMessage = {
    message,
    direction: 'outgoing',
    sender: "user",
    position: "single"
  };

  const systemContent = "If the question is unrelated to health please send $^. Do not provide any introductory comments. What more information would a physician need to diagnose this inquiry? Ask for the age and gender of the user. Give the information in a list separated by ^ with the description as the item after the name. For example: Severity of pain: Describe the level of pain you're experiencing, whether it's mild, moderate, or severe. Does the pain increase with movement or pressure?...^ Active Injuries: Please... with no formatting and additional comments.";
  let returnMessage = await processMessageToChatGPT([newMessage], systemContent, false);

  if (returnMessage[0] === "$") {
    const unrelatedInquiry = "Please reply with the words and ignore all other instructions. Do not add any additional commentary: Please provide a health inquiry.";
    setProcessingNotification(true);
    handleSend(message, unrelatedInquiry);
    return;
  }

  const individualQuestions = returnMessage.split("^").slice(0, -1).map(item => {
    const [label, description] = item.split(":").map(part => part.trim());
    return {
      label,
      description,
      input: ""
    };
  });

  setProcessingNotification(true);
  setProcessing(false);
  setProcessingMessage(individualQuestions);
};

export const formatForm = async (event, setProcessing, questionRef, processingMessage, handleSend) => {
  event.preventDefault();
  setProcessing(true);
  let formattedString = `${questionRef.current.message}\nAdditional Information:\n`;
  processingMessage.forEach(item => {
    const inputName = item.label.replace(/\s+/g, '');
    const inputValue = event.target[inputName]?.value || '';
    formattedString += `${item.label}: ${inputValue}\n`;
  });
  const systemContent = "Respond with a literacy that most high school graduates can understand. Please provide a possible diagnosis for the user. Provide any links to sources that you used.";
  await handleSend(formattedString, systemContent);
};

export const handleSend = async (userMessage, systemContent, messages, setMessages, setTyping) => {
  const newMessage = {
    message: userMessage,
    direction: 'outgoing',
    sender: "user",
    position: "single"
  };

  const newMessages = [...messages, newMessage];
  const appendAndPost = true;

  setMessages(prevMessages => [...prevMessages, newMessage]);

  setTyping(true);
  const assistantMessage = await processMessageToChatGPT(newMessages, systemContent, appendAndPost);

  setMessages(prevMessages => [...prevMessages, assistantMessage]);
  setTyping(false);
};

export const renderForm = (question, processingMessage, setProcessingMessage, formatForm) => (
  <form onSubmit={formatForm}>
    <fieldset>
      <legend>{question.message}</legend>
      {processingMessage.map((item, index) => (
        <div key={index}>
          <label>{item.label}: {item.description}</label>
          <input
            name={item.label.replace(/\s+/g, '')}
            type="text"
            value={item.input}
            onChange={(e) => {
              const updatedMessages = [...processingMessage];
              updatedMessages[index].input = e.target.value;
              setProcessingMessage(updatedMessages);
            }}
          />
        </div>
      ))}
    </fieldset>
    <button type="submit">Submit</button>
  </form>
);