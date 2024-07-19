import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { processMessageToChatGPT } from '../GPTChatProcessor';

function LanguageSelection({ question, setQuestion, setLanguage}) {
  const [selectedValues, setSelectedValues] = useState(
    question.map((part) => (part.type === 'dropdown' ? '' : null))
  );

  const handleChange = (index, value) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = value;
    setSelectedValues(newSelectedValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let finalString = '';
    question.forEach((part, index) => {
      if (part.type === 'text') {
        finalString += part.value;
      } else if (part.type === 'dropdown') {
        finalString += selectedValues[index];
      }
    });
    setLanguage(true);
    
    // await handleProcessing(await adjustGrammar(finalString), setProcessingNotification, setProcessing, setQuestion, 
    //   (msg, sysContent) => handleSend(msg, sysContent, messages, setMessages, setTyping), setProcessingMessage);
  };

  async function adjustGrammar(question) {
    const newMessage = {
      message: question,
      direction: 'outgoing',
      sender: "user",
      position: "single"
    };  

    return await processMessageToChatGPT([newMessage], "Adjust the message to be gramatically correct, keep the structure of the original sentence.", false);
  }

  return (
    <Form onSubmit={handleSubmit} className='flex flex-col items-end'>
      <div>
        {question.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.value}</span>;
          } else if (part.type === 'dropdown') {
            return (
              <Form.Select
                key={index}
                value={selectedValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              >
                {part.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </Form.Select>
            );
          }
        })}
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default LanguageSelection;