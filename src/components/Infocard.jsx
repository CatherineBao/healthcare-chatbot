import '../App.css';
import '../index.css';

function Sidebar() {
  return (
    <div className='text-white w-1/3 text-center flex flex-col items-center pl-8 gap-5'>
        <h1 className='mt-12 text-xl font-bold uppercase'> Personal Health Assistant </h1>
        <div className='bg-white h-96 rounded-lg w-full flex flex-col items-center'>
            <div className='bg-blue h-36 w-36 rounded-full mt-10'/>
            <div className='h-14 w-48 rounded-full bg-blue mt-5'></div>
            <div className='h-14 w-48 rounded-full bg-blue mt-5'></div>
        </div>
    </div>
  );
}

export default Sidebar;