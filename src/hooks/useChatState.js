import { useState, useRef, useEffect } from 'react';

const useChatState = () => {
  const [typing, setTyping] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [processingNotification, setProcessingNotification] = useState(true);
  const [messages, setMessages] = useState([
    {
      message: "Welcome, I'll be your assistant today. Please ask me any health related questions!",
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

  const [isHovered, setIsHovered] = useState(false);

  const [personalInfo, setPersonalInfo] = useState([]);
  const [chatHistory, setChatHistory] = useState("");

  return {
    typing, setTyping,
    processing, setProcessing,
    processingNotification, setProcessingNotification,
    messages, setMessages,
    processingMessage, setProcessingMessage,
    question, setQuestion,
    questionRef,
    isHovered, setIsHovered,
    personalInfo, setPersonalInfo,
    chatHistory, setChatHistory
  };
};

export default useChatState;