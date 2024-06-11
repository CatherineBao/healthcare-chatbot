import '../../App.css';
import '../../index.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <div className='fixed top-0 z-10 w-full bg-gray-blue drop-shadow-md z-30 sticky relative h-[8vh] text-white p-3 flex items-center justify-between'>
        <div className='flex gap-5 items-center ml-1'>
            <FontAwesomeIcon icon={faBars} />
            <h1>Name Goes Here</h1>
        </div>
        <h1>Personal Health Assistant</h1>
    </div>
  );
}

export default Header;