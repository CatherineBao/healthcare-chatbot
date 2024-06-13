import { useState } from 'react';
import { formatForm } from './Processing';

function SurveyComponent({ question, processingMessage }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputValue, setInputValue] = useState(processingMessage[0].item || '');

  function goBack() {
    const newQuestionIndex = currentQuestion - 1;
    setCurrentQuestion(newQuestionIndex);
    setInputValue(processingMessage[newQuestionIndex].item || '');
  }

  function goForward() {
    const newQuestionIndex = currentQuestion + 1;
    setCurrentQuestion(newQuestionIndex);
    setInputValue(processingMessage[newQuestionIndex].item || '');
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
    processingMessage[currentQuestion].item = event.target.value;
  }

  return (
    <div className='flex flex-col items-end w-full text-white font-semibold mt-4'>
      <form onSubmit={formatForm} className='bg-blue rounded-l-lg rounded-t-lg p-2 w-5/6'>
        <fieldset className='p-3'>
          <legend>{question.message}</legend>
          <label>{processingMessage[currentQuestion].label} ({processingMessage[currentQuestion].description})</label>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
          />
        </fieldset>
        <div className='w-full flex justify-end p-2'>
          <button
            type="button"
            onClick={goBack}
            disabled={currentQuestion === 0}
          >
            Back
          </button>
          <button
            type="button"
            onClick={goForward}
            disabled={currentQuestion === processingMessage.length - 1}
          >
            Next
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export { SurveyComponent };