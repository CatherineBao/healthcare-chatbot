import React from 'react';
import './App.css';
import Chat from './components/chatbot/ChatUI';
import Card from "./components/Infocard"
import Footer from './components/navigation/footer';

function App() {
  return (
    <div className='text-left bg-dark-blue'>
      <div className='flex pl-14'>
        <Card />
        <Chat />
      </div>
      <Footer />
    </div>
  );
}

export default App;