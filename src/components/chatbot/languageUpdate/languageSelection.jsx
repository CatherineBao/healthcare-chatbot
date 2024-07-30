import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { processMessageToChatGPT } from '../GPTChatProcessor';

function LanguageSelection({ question, setQuestion, setLanguage, handleProcessing }) {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const initialValues = question.map((part) =>
      part.type === 'dropdown' ? part.options[0] : ''
    );
    setSelectedValues(initialValues);
  }, [question]);

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

    console.log(finalString);

    const newQuestion = await adjustGrammar(finalString);
    setQuestion(newQuestion);
    console.log(newQuestion);
    setLanguage(true);

    handleProcessing(newQuestion);
  };

  async function adjustGrammar(question) {
    const newMessage = {
      message: question,
      direction: 'outgoing',
      sender: "user",
      position: "single"
    };

    return await processMessageToChatGPT([newMessage], "Adjust the message to be grammatically correct and in the first person, keep the structure of the original sentence. Remove the additional information descripting terms in parentheses.", false);
  }

  return (
    <div className="text-white font-semibold mt-4 text-sm mb-8 max-w-[80%] flex">
      <Form onSubmit={handleSubmit} className="flex flex-col items-end bg-blue rounded-l-lg rounded-t-lg p-3 mt-3 p-6">
        <div className="w-full leading-[3rem]">
          {question.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index}>{part.value}</span>;
            } else if (part.type === 'dropdown') {
              return (
                <select
                  key={index}
                  value={selectedValues[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className='text-dark-blue p-2 rounded-md max-w-60'
                >
                  {part.options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              );
            }
            return null;
          })}
        </div>
        <Button type="submit" className='duration-300 rounded-full ring ring-white hover:bg-white hover:text-blue h-8 w-20 mt-5'>Submit</Button>
      </Form>
    </div>
  );
}

export default LanguageSelection;