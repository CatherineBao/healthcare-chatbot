import { useState, useRef, useEffect } from 'react';

const useChatState = () => {
  const [typing, setTyping] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [processingNotification, setProcessingNotification] = useState(true);
  const [messages, setMessages] = useState([
    {
      message: "HELLOOO",
      sentTime: "just now",
      sender: "gipity",
      direction: "incoming",
      position: "single"
    }
  ]);
  const [processingMessage, setProcessingMessage] = useState([]);
  const [question, setQuestion] = useState({
    message: " ",
    sentTime: "just now",
    sender: "user",
    direction: "outgoing",
    position: "single"
  });

  const questionRef = useRef(question);
  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  return {
    typing,
    setTyping,
    processing,
    setProcessing,
    processingNotification,
    setProcessingNotification,
    messages,
    setMessages,
    processingMessage,
    setProcessingMessage,
    question,
    setQuestion,
    questionRef
  };
};

export default useChatState;