import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './components/chatbot/ChatUI';
import Footer from './components/navigation/footer';

function App() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isHovered]);

  return (
    <div className='text-left bg-dark-blue'>
      <div className='flex pl-14'>
        <div className='text-white w-1/3 text-center flex flex-col items-center pl-8 gap-5'>
          <h1 className='mt-12 text-xl font-bold uppercase'> Personal Health Assistant </h1>
          <div className='bg-white h-96 rounded-lg w-full flex flex-col items-center'>
            <div className='bg-blue h-36 w-36 rounded-full mt-10'/>
            <div className='h-14 w-48 rounded-full bg-blue mt-5'></div>
            <div className='h-14 w-48 rounded-full bg-blue mt-5'></div>
          </div>
        </div>
        <div className='w-full'        
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
            <Chat />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;