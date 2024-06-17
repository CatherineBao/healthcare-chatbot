import '../../App.css';
import '../../index.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, InputToolbox } from '@chatscope/chat-ui-kit-react';
import useChatState from '../../hooks/useChatState';
import { useEffect, useRef } from 'react';
import { handleProcessing, formatForm, handleSend } from './survey/Processing';
import HealthForm from './survey/Survey';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

function Chat() {
  const {
    typing, setTyping,
    processing, setProcessing,
    processingNotification, setProcessingNotification,
    messages, setMessages,
    processingMessage, setProcessingMessage,
    question, setQuestion,
    questionRef,
    isHovered, setIsHovered
  } = useChatState();

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
        <div className='w-6 h-6 bg-blue rounded-full'/>
        <h1>Name goes here</h1>
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
            : null}>
            {messages.map((message, i) => {
              return <Message key={i} model={message} />
            })}
            {!processing ? (
              <HealthForm
                question = {question}
                processingMessage = {processingMessage}
                setProcessingMessage = {setProcessingMessage}
                formatForm = {(e) => formatForm(e, setProcessing, questionRef, processingMessage, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping))}
              />
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
                onSend={(message) => handleProcessing(message, setProcessingNotification, setProcessing, setQuestion, questionRef, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), setProcessingMessage)} 
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