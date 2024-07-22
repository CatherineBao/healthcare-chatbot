import React, { useEffect } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox } from '@chatscope/chat-ui-kit-react';
import { useChatContext } from '../../components/ChatContext';
import { handleProcessing, formatForm, handleSend, handleLanguage } from './survey/Processing';
import HealthForm from './survey/Survey';
import LanguageSelection from './languageUpdate/languageSelection'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faRobot } from "@fortawesome/free-solid-svg-icons";
import '../../App.css';
import '../../index.css';

function Chat() {
  const {
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
  } = useChatContext();

  function scrollToBottom() {
    const scrollableDiv = document.querySelector('.cs-message-list__scroll-wrapper');
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }

  useEffect(() => {
    if (isHovered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isHovered]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='w-full flex flex-col items-end mb-10 p-10'>
      <div className='w-full flex bg-white h-12 rounded-t-lg items-center p-3 gap-3'>
        <FontAwesomeIcon icon={faRobot} className='w-6 h-6 text-blue' />
        <h1>Dr. Gipity</h1>
      </div>
      <MainContainer className='w-full bg-white mb-8 rounded-b-lg p-5 h-[75vh]'>
        <ChatContainer className='bg-white'>
          <MessageList
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            scrollBehavior="smooth"
            typingIndicator={typing ? 
              <TypingIndicator 
                content="Gipity is typing" 
                style={{
                  backgroundColor: "#F3F7F9",
                  position: 'sticky',
                  bottom: 0
                }}
              /> 
              : null
            }>
            {messages.map((message, i) => {
              return <Message key={i} model={message} />
            })}
            {!language ? (
              <div className='w-full flex justify-end pr-5'>
                <LanguageSelection question={processingLanguage} setQuestion = {setQuestion} setLanguage = {setLanguage} handleProcessing = {(q) => handleProcessing(q, setProcessingNotification, setProcessing, setQuestion, 
                  (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), setProcessingMessage)}/>
              </div>
            ) : null}
            {!processing ? (
              <div className='w-full flex justify-end pr-5'>
                <HealthForm
                  question={question}
                  processingMessage={processingMessage}
                  setProcessingMessage={setProcessingMessage}
                  formatForm={(e) => 
                    formatForm(e, setProcessing, question, processingMessage, 
                      (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), 
                      setPersonalInfo, chatHistory, setChatHistory, personalInfo)}
                />
              </div>
            ) : null}
          </MessageList>
          <InputToolbox className='flex flex-col justify-center items-start m-5'>
            <div>
              {!processingNotification ? (
                <div className='sticky bottom-0 w-full bg-white text-blue flex justify-start mb-5'>
                  <p>Processing input...</p>
                </div>
              ) : null}
              {typing ? (
                <div className='sticky bottom-0 w-full bg-white text-blue flex justify-start mb-5'>
                  <p>Gipity is typing...</p>
                </div>
              ) : null}
            </div>
            <div className='flex justify-center items-center w-full'>
            <MessageInput 
              className='w-full gap-5 justify-center items-center'
              placeholder="Type message here" 
              onSend={async (message) => {
                await handleLanguage(message, setProcessingLanguage, setLanguage, setProcessingNotification, messages, setMessages, setTyping, setProcessing);
              }} 
                attachButton={false}
              />
              <FontAwesomeIcon icon={faCaretDown} className='text-blue cursor-pointer' onClick={scrollToBottom}/>
            </div>
          </InputToolbox>
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;