import '../App.css';
import '../index.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import useChatState from '../hooks/useChatState';
import { handleProcessing, formatForm, handleSend, renderForm } from './Survey';

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
    <div className='w-full flex justify-end'>
      <MainContainer className='w-3/4 bg-white m-8 rounded-lg p-5 overflow-y-auto max-h-5/6'>
        <ChatContainer className='bg-white'>
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
              renderForm(question, processingMessage, setProcessingMessage, (e) => formatForm(e, setProcessing, questionRef, processingMessage, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping)))
            ) : null}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={(message) => handleProcessing(message, setProcessingNotification, setProcessing, setQuestion, questionRef, (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), setProcessingMessage)} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;