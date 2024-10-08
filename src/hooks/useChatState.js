import { useState, useRef, useEffect } from 'react';

const useChatState = () => {
  const [typing, setTyping] = useState(false);
  const [language, setLanguage] = useState(true);
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
  const [processingLanguage, setProcessingLanguage] = useState([]);
  const [question, setQuestion] = useState("");

  const questionRef = useRef(question);
  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  const [isHovered, setIsHovered] = useState(false);

  const [personalInfo, setPersonalInfo] = useState([]);
  const [chatHistory, setChatHistory] = useState("");

  return {
    typing, setTyping,
    language, setLanguage,
    processing, setProcessing,
    processingNotification, setProcessingNotification,
    processingLanguage, setProcessingLanguage,
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