import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { processMessageToChatGPT } from '../GPTChatProcessor';

function LanguageSelection({ question, setQuestion, setLanguage, handleProcessing}) {
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

    const newQuestion = await adjustGrammar(finalString);
    setQuestion(newQuestion);
    console.log(newQuestion);
    setLanguage(true);
    
    handleProcessing(newQuestion)
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
    <div className='text-white font-semibold mt-4 text-sm mb-8 max-w-4/5'>
    <Form onSubmit={handleSubmit} className='flex flex-col items-end bg-blue rounded-l-lg rounded-t-lg p-3 mt-3 max-w-5/6 p-6'>
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
                className='text-dark-blue'
              >
                {part.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </Form.Select>
            );
          }
        })}
      </div>
      <Button type="submit" className='duration-300 rounded-full ring ring-white hover:bg-white hover:text-blue h-8 w-20 mt-5'>Submit</Button>
    </Form>
    </div>
  );
}

export default LanguageSelection;