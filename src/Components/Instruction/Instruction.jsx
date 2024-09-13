import React, {useState} from "react";
import { Link } from "react-router-dom";

const Instruction = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

  return (
    <div className="flex flex-col gap-8 p-[5%] py-10 font-pop">
      <div className="font-semibold text-xl">Here are the online test instructions for an AI-proctored PAP (Pay After Placement) test, with additional alerts for specific behaviour</div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#1dbf73] font-bold">
        Getting Ready:
        </h1>
        <ul className="list-inside pl-6 flex flex-col gap-2">
          <li>Ensure you have a working webcam and microphone connected to your computer.</li>
          <li>Find a quiet, well-lit room with a clean desk/table to take the test.</li>
          <li>Close all other programs and browsers before starting the test.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#1dbf73] font-bold ">
        Launching the Test:
        </h1>
        <p>
          <ol className="list-inside list-decimal pl-6 flex flex-col gap-2 mt-2">
            <li>Log into the test portal using the provided credentials.</li>
            <li>Follow the instructions to launch the AI proctoring software</li>
          </ol>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#1dbf73] font-bold ">
        During the Test:
        </h1>
        <p>
          <ol className="list-inside list-decimal pl-6 flex flex-col gap-2 mt-2">
            <li>The AI proctor will continuously monitor you via webcam and microphone.</li>
            <li>Do not leave the testing area or have unauthorized materials/devices nearby.</li>
            <li>The AI will flag any suspicious behaviour for review</li>
          </ol>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#1dbf73] font-bold ">
        Alerts:
        </h1>
        <p>
          <ul className="list-inside list-decimal pl-6 flex flex-col gap-2 mt-2">
            <li>3 Times Alert: If you leave the testing area or look away from the screen for an extended period, you will receive an alert.</li>
            <li>2 Person Alert: If the AI detects a second person in the testing area, you will receive an alert.</li>
            <li>Tab Change Alert: If you switch tabs or windows during the test, you will receive an alert.</li>
            <li>New Window Alert: If you open a new window during the test, you will receive an alert.</li>
            <li>Block User Alert: After 3 alerts for leaving the testing area or looking away, you will be blocked from continuing the test.</li>
          </ul>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#1dbf73] font-bold ">
        Submitting the Test:
        </h1>
        <p>
          <ol className="list-inside list-decimal pl-6 flex flex-col gap-2 mt-2">
            <li>Once complete, click "Submit Test" and follow any additional instructions.</li>
            <li>The AI proctor recording will be reviewed to ensure test integrity.</li>
          </ol>
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <input 
          type='checkbox' 
          id='declaration' 
          checked={isChecked} 
          onChange={handleCheckboxChange} 
        />
        <label >
          I declare that I have read and understood the instructions, and I agree to abide by the rules.
        </label>
      </div>
      <div>
      <Link to='/modules'
        className={`mt-4 px-4 py-2 bg-[#1dbf73] text-white font-bold rounded ${isChecked ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'}`} 
        disabled={!isChecked}
      >
        Ready to Begin
      </Link>
      </div>
    </div> 
  );
};

export default Instruction;
 