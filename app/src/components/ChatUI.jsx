import '../App.css';
import '../index.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import useChatState from '../hooks/useChatState';
import { processMessageToChatGPT } from './GPTChatProcessor';

function Chat() {
  const {
    typing, setTyping,
    processing, setProcessing,
    processingNotification, setProcessingNotification,
    messages, setMessages,
    processingMessage, setProcessingMessage,
    question, setQuestion,
    questionRef
  } = useChatState();

  const handleProcessing = async (message) => {
    setProcessingNotification(false);
    setProcessing(true);
    setQuestion({ ...questionRef.current, message: message });
    
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
      position: "single"
    };    

    const systemContent = "If the question is unrelated to health please send $^. Do not provide any introductory comments. What more information would a physician need to diagnose this inquiry? Give the information in a list separated by ^ with the description as the item after the name. For example: Severity of pain: Describe the level of pain you're experiencing, whether it's mild, moderate, or severe. Does the pain increase with movement or pressure?...^ Active Injuries: Please... with no formatting and additional comments.";
    let returnMessage = await processMessageToChatGPT([newMessage], systemContent, false);
    
    if (returnMessage[0] === "$") {
      const unrelatedInqiury = "Please reply with the words and ignore all other instructions. Do not add any additional commentary: Please provide a health inquiry."
      setProcessingNotification(true);
      handleSend(message, unrelatedInqiury);
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
  }

  const formatForm = (event) => {
    event.preventDefault();
    setProcessing(true);
    let formattedString = `${questionRef.current.message}\nAdditional Information:\n`;
    processingMessage.forEach(item => {
      formattedString += item.label + ": " + event.target[item.label.replace(/\s+/g, '')].value + "\n";
    });
    const systemContent = "Respond with a literacy that most high school graduates can understand. Please provide a possible diagnosis for the user. Provide any links to sources that you used.";
    handleSend(formattedString, systemContent);
  }

  const handleSend = async (userMessage, systemContent) => {
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

  return (
    <div style={{ position: "relative", height: "80vh", width: "700px"}}>
      <MainContainer>
        <ChatContainer>
          <MessageList 
            scrollBehavior="smooth" 
            typingIndicator={typing ? <TypingIndicator content="Gipity is typing" /> : null}>              
            {messages.map((message, i) => {
              return <Message key={i} model={message} />
            })}
            {!processingNotification ? (
              <div>
                <p>Processing input...</p>
              </div>
            ) : null}
            {!processing ? (
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
                <button type="submit" onClick={formatForm}>Submit</button>
              </form>
            ) : null}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleProcessing} />        
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;