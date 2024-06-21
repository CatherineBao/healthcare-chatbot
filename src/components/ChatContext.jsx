import React, { createContext, useContext } from 'react';
import useChatState from '../hooks/useChatState';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chatState = useChatState();
  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};