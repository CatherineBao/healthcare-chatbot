import React from 'react';
import { useChatContext } from './ChatContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faUser } from "@fortawesome/free-solid-svg-icons";
import '../App.css';
import '../index.css';

function InfoCard() {
  const { personalInfo } = useChatContext();

  return (
    <div className='text-white w-1/3 text-center flex flex-col items-center pl-8 gap-5'>
      <h1 className='mt-12 text-xl font-bold uppercase'> Personal Health Assistant </h1>
      <div className='p-5 bg-white h-96 rounded-lg w-full flex flex-col items-center'>
        <div className='text-blue w-full'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex gap-3'>
            <FontAwesomeIcon icon={faUser} className='w-7 h-7 text-blue'/>
              <h1 className='font-bold'>Patient Information</h1>
            </div>
            <FontAwesomeIcon icon={faFileExport} className='text-blue cursor-pointer'/>
          </div>
          <div className='overflow-y-auto h-72 text-left w-full mt-4 border-4 rounded-lg p-3'>
            {personalInfo.map((item, index) => (
              <div key={index} className='mb-2'>
                <h1 className='font-semibold'>{item.Topic}</h1>
                {item.Info.map((characteristic, num) => (
                  <p key={num} className='mb-1'>{characteristic}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;