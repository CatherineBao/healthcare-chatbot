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
as needed. These explanations will be referred to as descriptions. Don't have any additional formatting such as bullet points or numbering.
Having more topics is better than less (aim for 5). Try to make the questions shorter and more consice so it's easier to answer. 
Do not put a ^ after the last topic. 
\n
Formatting and Content Examples:\n
Q: I got a cut a few weeks ago and it hasn’t healed yet recently it started hurting more than usual and it looks red on the outside. Should I be concerned?\n
A: Redness in the area of the wound: Is the redness spreading or forming a red streak? Can you describe the appearance of the redness?^Condition of the wound: Is there swelling, warmth, pain, or tenderness in the area of the cut?^Pus: Is there any pus forming around or oozing from the wound?^Lymph nodes: Do you have swollen lymph nodes in the neck, armpit, or groin?^Other Symptoms: Do you have a fever or other new developments to note?\n
\n
Q: Hello, what is the weather like today?\n
A: $^ \n
\n
Q: Are there safety concerns or special precautions about Acetaminophen?\n
A: %^ \n
\n
Respond with only one of the following:\n
1. If the question is related to diagnoses (mental health indications (sadness, depression, anxiety) should be considered for diagnoses). Ask for at least 5 topics and DO NOT put a ^ at the end of the message:\n
topic:description^topic:description\n
Example:  Location of pain: Is the pain in one knee or both knees?^Previous injuries:Have you had any previous injuries to your knees?\n
2. If the question is unrelated to diagnoses but is related to healthcare please respond with: %^ \n
3. If the question is unrelated to healthcare please respond with $^ \n
\n
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
  event.preventDefault();
  setProcessing(true);

  // COME BACK TO THIS LATER:
  // const highlightInformation = `
  // Go through the question and put ^^ around all components of the question that could give information and hints for a diagnosis such as statistics about duration of symptoms, blood pressure, weight, height, gender, symptoms, etc. Keep all of the original text and don't add additional formatting such as bullet points:
  // \n
  // Example: \n
  // Q: I am a 57yo male 62 154 lbs. I have been without insurance for 2.5 years now. I have been out of my blood pressure medicine for 2 years now. My blood pressure runs around 200/105. 2 years ago I took an international flight. When i got off of a 12 hour flight my left calf stopped working. If I walk at my normal pace I can only make it about Then I spent another 24 hours or so in the back seat of a Toyota high ace van. which has even less room to move.If I walk at my normal pace I can only make it about 30 yards before it starts to feel swollen and tight and then the pain starts. Now after 2 years of not being able to walk both of my legs hurt all the time and I can barely walk for the first 2 hours of the day. I have a customer where I work, She is a nutritionist. She says that I am "severely malnourished" I suspect that I won"t make it to Christmas. Any Ideas?
  // \nA:I am a ^^57yo male 62 154 lbs^^. I have been without insurance for 2.5 years now. I have been ^^out of my blood pressure medicine for 
  // 2 years now^^. My ^^blood pressure runs around 200/105^^. 2 years ago I took an international flight. When i got off of a 12 hour flight 
  // ^^my left calf stopped working^^. If I walk at my normal pace I can only make it about Then I spent another 24 hours or so in the back 
  // seat of a Toyota high ace van. which has even less room to move.If I walk at my normal pace ^^I can only make it about 30 yards before 
  // it starts to feel swollen and tight and then the pain starts^^. Now after ^^2 years of not being able to walk^^ both of my legs hurt all 
  // the time and I can barely walk for the first 2 hours of the day. I have a customer where I work, She is a nutritionist. She says that 
  // ^^I am "severely malnourished"^^ I suspect that I won"t make it to Christmas. Any Ideas?
  // `;
  
  // const newMessage = {
  //   message: `${questionRef.current.message}`,
  //   direction: 'outgoing',
  //   sender: "user",
  //   position: "single"
  // };

  // const highlightedQuestion = await processMessageToChatGPT([newMessage], highlightInformation, false);
  // let formattedString = `${highlightedQuestion}\nAdditional Information:\n`;

  let formattedString = `${questionRef.current.message}\nAdditional Information:\n`;
  
  for (let i = 0; i < processingMessage.length; i++) {
    const inputValue = processingMessage[i].input || ''; // Access the item property directly
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