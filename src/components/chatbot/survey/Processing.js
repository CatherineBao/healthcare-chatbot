import { processMessageToChatGPT } from '../GPTChatProcessor';

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
  
    const systemContent = `
  Create a list of additional information, questions, or symptoms that a doctor will ask about to create a more accurate diagnosis.  
  These additional questions will be referred to as topics. Each topic will be followed by a short explanation elaborating on the details 
  as needed. These explanations will be referred to as descriptions.\n
  \n
  Respond with only one of the following: \n
  1. If the question is related to diagnoses (mental health indications (sadness, depression, anxiety, etc.) should be considered for diagnoses): \n
  topic:description^topic:description^\n
  Example:  Location of pain:Is the pain in one knee or both knees?^Previous injuries:Have you had any previous injuries to your knees?\n
  \n
  2. If the question is unrelated to diagnoses but is related to healthcare please respond with or it's a health condition where immediate attention is required: %^ \n
  3. If the question is unrelated to healthcare please respond with $^
  Notes:\n
  1. Don’t include any additional commentary or formatting outside of specifications.\n
  2. Don’t include points that were already stated in the original question.\n
  3. Ask about basic personal information such as age, gender, weight, and race if it applies to the question.\n
  `;
  
    let returnMessage = await processMessageToChatGPT([newMessage], systemContent, false);
    console.log(returnMessage);
  
    if (returnMessage[0] === "$") {
      const unrelatedInquiry = "Respond that you can only help with healthcare-related topics and prompt the user to ask a different question. Do not respond to the user's question. Use a polite and apologetic tone.";    setProcessingNotification(true);
      console.log("unrelatedInquiry");
      handleSend(message, unrelatedInquiry);
      return;
    }
    else if (returnMessage[0] === "%") {
      const nondiagnosesInquiry = "Respond with a literacy that most high school graduates can understand. If the medical inquiry needs immediate attention (suicide, heart attack, stroke, poisen, etc.) provide a hotline for the user to call (suicide hotline, poison control, 911, etc.)\n";
      console.log("nondiagnosesInquiry");
      setProcessingNotification(true);
      handleSend(message, nondiagnosesInquiry);
      return;
    }
  
    const individualQuestions = returnMessage.split("^").map(item => {
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
    setProcessing(true);
    let formattedString = `${questionRef.current.message}\nAdditional Information:\n`;
  
    for (let i = 0; i < processingMessage.length; i++) {
      const inputValue = processingMessage[i].item || ''; 
      formattedString += `${processingMessage[i].label}: ${inputValue}\n`;
    }
  
    const systemContent = `
    Provide the following response to the user’s medical inquiry:\n
    Using the specific details that they provide please provide \n
    1. A possible diagnosis for the illness that the user is facing \n
    2. Possible home treatments that the user can partake in to ease symptoms \n
    3. Recommendations for moving forward (at-home rest, seeing a specialist). Please provide details about the process of moving forward. If a user should see a specialist please suggest what kind of doctor they should visit. \n
    4. Add more sections as needed for specific questions.
    5. Provide links and website names for more information at the end of the response.\n
    6. If the medical inquiry needs immediate attention provide a hotline for the user to call (suicide hotline, poison control, 911, etc.) don’t provide any of the information before. \n
    \n
    Notes: \n 
    1. Please format a readable message with headers:\n
    Example:\n
    Diagnosis:\n
    Information\n
    Home-Treatments:\n
    Information\n
    ...`;
  
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