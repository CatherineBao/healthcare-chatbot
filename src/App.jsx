import React from 'react';
import './App.css';
import Chat from './components/chatbot/ChatUI';
import { ChatProvider } from './components/ChatContext';
import InfoCard from "./components/Infocard"
import Footer from './components/navigation/footer';

function App() {
  return (
    <div className='text-left bg-dark-blue'>
      <div className='flex pl-14'>
        <ChatProvider>
          <InfoCard />
          <Chat />
        </ChatProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;