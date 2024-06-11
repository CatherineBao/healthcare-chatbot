import '../../App.css';
import '../../index.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import useChatState from '../../hooks/useChatState';
import { handleProcessing, formatForm, handleSend, renderForm } from './Survey';
import { useEffect, useRef } from 'react';

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

  return (
    <div className='w-full flex flex-col items-end mb-10 p-10'>
      <div className='w-full flex bg-white h-12 rounded-t-lg items-center p-3 gap-3'>
        <div className='w-6 h-6 bg-blue rounded-full'/>
        <h1>Name goes here</h1>
      </div>
      <MainContainer className='w-full bg-white mb-8 rounded-b-lg p-5 h-[75vh]'>
        <ChatContainer className='bg-white'>
          <MessageList
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
              renderForm(question, processingMessage, setProcessingMessage, (e) => formatForm(e, setProcessing, questionRef, processingMessage, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping)))
            ) : null}
            {!processingNotification ? (
              <div>
                <p>Processing input...</p>
              </div>
            ) : null}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={(message) => handleProcessing(message, setProcessingNotification, setProcessing, setQuestion, questionRef, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), setProcessingMessage)} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;