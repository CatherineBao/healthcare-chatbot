import { useState } from 'react';

function HealthForm({question, processingMessage, setProcessingMessage, formatForm }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputValue, setInputValue] = useState(processingMessage[0]?.input);
  const button = 'duration-300 rounded-full ring ring-blue hover:bg-blue hover:text-white h-8 w-20'

  function goBack() {
    const newQuestionIndex = currentQuestion - 1;
    setCurrentQuestion(newQuestionIndex);
    setInputValue(processingMessage[newQuestionIndex]?.input);
  }

  function goForward() {
    const newQuestionIndex = currentQuestion + 1;
    setCurrentQuestion(newQuestionIndex);
    setInputValue(processingMessage[newQuestionIndex]?.input);
  }

  return (
    <div className='flex flex-col items-end w-full text-white font-semibold mt-4 text-sm mb-8 w-4/5'>
      <h1 className='bg-blue rounded-l-lg rounded-t-lg p-3'>{question}</h1>
      <form 
      onSubmit={(e) => formatForm(e)}
      className='bg-blue rounded-l-lg rounded-t-lg p-3 mt-3 w-5/6 p-4'
      >
        <div className='p-3 bg-white rounded-lg text-blue'>
          <label className='font-bold mb-3 uppercase text-lg'>
            {processingMessage[currentQuestion]?.label} <br/>
          </label>
          <label className='mb-3'>
          {processingMessage[currentQuestion]?.description}
          </label>
          <textarea
            className='focus:outline-none focus:shadow-outline border-blue bg-white border-4 p-3 rounded-lg w-full mt-5'
            name={processingMessage[currentQuestion]?.label.replace(/\s+/g, '')}
            type="text"
            value={inputValue}
            onChange={(e) => {
              const updatedMessages = [...processingMessage];
              updatedMessages[currentQuestion].input = e.target.value;
              setProcessingMessage(updatedMessages);
              setInputValue(e.target.value);
            }}
          />
          <div className='w-full flex justify-between items-center mt-3'>
            <h1>{currentQuestion + 1}/{processingMessage.length}</h1>
            <div className='flex justify-end p-2 gap-5'>
              <button
                type="button"
                onClick={goBack}
                disabled={currentQuestion === 0}
                className={`${button} ${currentQuestion === 0 ? 'hidden' : ''}`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={goForward}
                disabled={currentQuestion === processingMessage.length - 1}
                className={`${button} ${currentQuestion === processingMessage.length - 1 ? 'hidden' : ''}`}
              >
                Next
              </button>
              <button 
                type="submit"
                disabled={currentQuestion !== processingMessage.length - 1}
                className={`${button} ${currentQuestion !== processingMessage.length - 1 ? 'hidden' : ''}`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HealthForm;