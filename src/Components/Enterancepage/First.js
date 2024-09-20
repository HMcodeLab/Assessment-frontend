import { FaPhoneAlt } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from "../../Api";
function First() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [query,setquery]=useSearchParams()
    const [data, setdata] = useState()
    const [continued, setcontinued] = useState(false)
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    };
    let assessmentToken= query.get('assessmenttoken')
    // localStorage.clear()
    if(assessmentToken){

      localStorage.setItem('assessmenttoken',assessmentToken)
  
    }
  let navigate=useNavigate()
  const [futureDate, setFutureDate] = useState(null);
  
    // Timer state
    const [timer, setTimer] = useState(0);
    const timerIntervalRef = useRef(null);
  
  useEffect(() => {
  
  async function Fetchdata() {
    try {
      const data=await fetch(BASE_URL+'/getUserAssessment?assessmentToken='+assessmentToken)
      const response=await data.json();
      if(response.success){
        localStorage.setItem('time'+assessmentToken,parseInt(response?.data?.timelimit)*60)
  setdata(response?.data)
  setFutureDate(new Date(response?.data?.startDate))
      }
    } catch (error) {
      
    }
  }
  Fetchdata()
  }, [])
  
  const calculateDuration = (futureDate) => {
    const now = new Date();
    const duration = Math.max(Math.floor((futureDate - now) / 1000), 0); // Ensure duration is not negative
    setTimer(duration);
  };
  
  // Start timer based on the current timer state
  const startTimer = () => {
    // Check if there's already an interval running to prevent multiple intervals
    if (timerIntervalRef.current) {
      return;
    }
  
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(timerIntervalRef.current); // Clear interval when timer reaches 0
          timerIntervalRef.current = null;
          // Add any logic you want to execute when the timer finishes
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000); // Update timer every second
  };
  useEffect(() => {
    // Start the timer once the future date is available
    if (futureDate) {
      calculateDuration(futureDate);
      startTimer();
    }
  
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [futureDate]); // Depend on futureDate to trigger timer calculation
  
  // Format time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

function handleContinue(){
setcontinued(true)
}
function formatDate(dateString) {
    const dateObj = new Date(dateString);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[dateObj.getMonth()];

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = `${hours}.${minutes}${ampm}`;

    return `${day} ${month} ${year} ${time}`;
  }
  const handleSubmit = async(e) => {
    //   e.preventDefault();
        const data1=await fetch(BASE_URL+'/verifyUserAccessForAssessment?assessmentToken='+assessmentToken+'&email='+data?.userAccess?.email)
        const response=await data1.json()
        // console.log(response);
        if(response?.success){
        //   toast.success(response?.msg)
          localStorage.setItem('USER',response.token)
          setIsSubmitted(true)
          navigate('/hardwarechecking')
        }
        else{
          toast.error(response?.message)
        }
      
    };
  return (<>
  <Toaster/>
    <div className=" bg-[#1DBF73] flex items-center justify-center p-4">
      <div className="  w-full h-[95vh]   shadow-lg flex     bg-green-100 overflow-hidden">
        <div className="h-[90%]  w-[60%]   text-white flex flex-col items-center">
        { timer!==0 ? <div className="text-center items-center">
            <h2 className="text-[16px] font-Poppins mt-[62px] mb-2 text-black font-semibold ">
              Your Test Will Be Live In
            </h2>
            <div className="bg-[#1F1F1F] h-[134.66px] w-[300.33px] rounded-lg  text-4xl border-[0.8px] flex justify-center items-center">
              {formatTime(timer)}
            </div>
            <div className=" flex flex-col justify-center items-center py-5">
              <img
                className="h-[73.16px] w-[189px] mt-28 "
                src="/image/log.png"
              />
            </div>
          </div>
        :
        new Date() > new Date(data?.lastDate) ?
        <div className="text-center items-center">
            <h2 className="text-[16px] font-Poppins mt-[62px] mb-2 text-black font-semibold ">
              Your test has been expired on
            </h2>
            <div className="bg-[#1F1F1F] h-[134.66px] w-[300.33px] rounded-lg  text-2xl border-[0.8px] flex justify-center items-center">
              {formatDate(data?.lastDate)}
            </div>
            <div className=" flex flex-col justify-center items-center py-5">
              <img
                className="h-[73.16px] w-[189px] mt-28 "
                src="/image/log.png"
              />
            </div>
          </div> 
:
<div className="text-center items-center">
            <h2 className="text-[16px] font-Poppins mt-[62px] mb-2 text-black font-semibold ">
              Your Test Will End On
            </h2>
            <div className="bg-[#1F1F1F] h-[134.66px] w-[300.33px] rounded-lg  text-2xl border-[0.8px] flex justify-center items-center">
              {formatDate(data?.lastDate)}
            </div>
            <div className=" flex flex-col justify-center items-center py-5">
              <img
                className="h-[73.16px] w-[189px] mt-28 "
                src="/image/log.png"
              />
            </div>
          </div>        }
          <div className="text-center  flex flex-col justify-center items-center">
            <p className=" text-[#3C3C3C] font-Poppinspins w-[365px] h-[43px] text-[24px] font-semibold ">
              Contact Us For Support
            </p>
            <div className="flex items-center space-x-4 text-[18px] ">
              <CgMail className="text-[#3C3C3C] font-semibold font-Poppins h-8 w-14" />
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins">
                support@hopingminds.com
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[18px] ">
              <FaPhoneAlt className="text-[#3C3C3C] font-semibold font-Poppins h-7 w-5" />
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins">
                +91 7447732467, 356263553
              </p>
            </div>
          </div>
        </div>

{
    continued?<div className="rounded-l-xl w-full pl-10 py-6    bg-white  boe ">
    <div className="">
      <p className=" w-[50vw] mt-10 text-[36px] font-bold font-Poppins">
        Here Are Few Instructions
      </p>
      <p className="text-4xl font-bold  h-10  font-Poppins">
        {" "}
        Before Doing The Test -
      </p>
    </div>
    <div className="max-w-2xl  overflow-y-auto bg-white mt-10 h-80 text-justify w-[100%]">
      <h1 className="text-2xl font-semibold mb-6">
        Here are the online test instructions for an AI-proctored PAP (Pay
        After Placement) Test: with additional alerts for specific
        behaviour
      </h1>

      <h2 className="text-xl font-bold text-green-600 mb-4">
        Getting Ready:
      </h2>
      <ul className="list-disc list-inside text-lg space-y-2">
        <li>
          Ensure you have a working webcam and microphone connected to
          your computer.
        </li>
        <li>
          Find a quiet, well-lit room with a clean desk/table to take the
          test.
        </li>
        <li>
          Close all other programs and browsers before starting the test.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-green-600 mt-8 mb-4">
        Launching the Test:
      </h2>
      <ol className="list-decimal list-inside text-lg space-y-2">
        <li>Log into the test portal using the provided credentials.</li>
        <li>
          Follow the instructions to launch the AI proctoring software.
        </li>
      </ol>

      <h2 className="text-xl font-bold text-green-600 mt-8 mb-4">
        During the Test:
      </h2>
      <ol className="list-decimal list-inside text-lg space-y-2">
        <li>
          The AI proctor will continuously monitor you via webcam and
          microphone.
        </li>
        <li>
          Do not leave the testing area or have unauthorized
          materials/devices nearby.
        </li>
        <li>The AI will flag any suspicious behaviour for review</li>
      </ol>

      <h2 className="text-xl font-bold text-green-600 mb-4">Alerts:</h2>
      <ol className="list-decimal list-inside text-lg space-y-2">
        <li>
          3 Times Alert: If you leave the testing area or look away from
          the screen for an extended period, you will receive an alert.
        </li>
        <li>
          2 Person Alert: If the AI detects a second person in the testing
          area, you will receive an alert.
        </li>
        <li>
          Tab Change Alert: If you switch tabs or windows during the test,
          you will receive an alert.
        </li>
        <li>
          New Window Alert: If you open a new window during the test, you
          will receive an alert.
        </li>
        <li>
          Block User Alert: After 3 alerts for leaving the testing area or
          looking away, you will be blocked from continuing the test.
        </li>
      </ol>

      <h2 className="text-xl font-bold text-green-600 mt-8 mb-4">
        Submitting the Test:
      </h2>
      <ol className="list-decimal list-inside text-lg">
        <li>
          Once complete, click "Submit Test" and follow any additional
          instructions.
        </li>
        <li>
          The AI proctor recording will be reviewed to ensure test
          integrity.
        </li>
      </ol>

      {/* <div className="mt-6 flex items-start">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-green-600"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label for="agree" className="text-lg">
          I declare that I have read and understood the instructions, and
          I agree to abide by the rules.
        </label>
      </div>

      <button
        disabled={!isChecked}
        className="mt-6 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
      >
        {isChecked ? "Ready to Begin" : " "}
      </button> */}
    </div>

    <button
      onClick={handleSubmit}
      className="w-[40vw] bg-[#1DBF73] mt-5 text-white py-2 rounded-lg font-semibold h-16  shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]"
    >
      Ready To Begin →
    </button>
  </div>:

        <div className="rounded-l-xl w-full pl-28 py-6  bg-white  boe">
          <div className="">
            <h2 className="w-115 text-[24px] font-semibold text-black font-Poppins pb-2">
              Welcome
            </h2>
            <p className=" w-[528px]  text-[36px] font-bold font-Poppins">
              It's Time To Complete Your
            </p>
            <p className="text-4xl font-bold  h-10 text-[#1DBF73] font-Poppins">
              {" "}
              {data?.assessmentName}
            </p>
          </div>

          <div className="relative w-[561px]  mt-12">
            <div
              className="peer transition-all px-5 py-3 w-full text-lg bg-[#f9f9f9] text-gray-600  rounded-md border bo outline-none shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)] ">{data?.userAccess?.name}</div>
            <label className="z-2 text-gray-500 pointer-events-none absolute left-5 top-0 h-fit flex items-center select-none transition-all text-sm px-1 bg-white -translate-y-1/2">
              Name
            </label>
          </div>
          <div className="relative w-[561px]  mt-5">
            <input
              className="peer transition-all px-5 py-3 w-full text-lg bg-[#f9f9f9] text-gray-600  rounded-md border bo outline-none shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]"
              type="text"
              value={data?.userAccess?.phone_number}
              readOnly
            />

            <label className="z-2 text-gray-500 pointer-events-none absolute left-5 top-0 h-fit flex items-center select-none transition-all text-sm px-1 bg-white -translate-y-1/2">
              Phone Number
            </label>
          </div>
          <div className="relative w-[561px]  mt-5">
            <input
              className="peer transition-all px-5 py-3 w-full text-lg bg-[#f9f9f9] text-gray-600  rounded-md border bo outline-none shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]"
              type="text"
              value={data?.userAccess?.college_name}
              readOnly
            />

            <label className="z-2 text-gray-500 pointer-events-none absolute left-5 top-0 h-fit flex items-center select-none transition-all text-sm px-1 bg-white -translate-y-1/2">
              College name
            </label>
          </div>
          <div className="relative w-[561px] flex mt-5">
            <input
              className="peer transition-all px-5 py-3 w-full text-lg bg-[#f9f9f9] text-gray-600  rounded-md border bo outline-none shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]"
              type="text"
              value={data?.userAccess?.email}
              readOnly
            />

            <label className="z-2 text-gray-500 pointer-events-none absolute left-5 top-0 h-fit flex items-center select-none transition-all text-sm px-1 bg-white -translate-y-1/2">
              Email
            </label>
          </div>

          <button
            onClick={handleContinue}
            className={`${new Date() > new Date(data?.startDate) && new Date() < new Date(data?.lastDate)? '':'cursor-not-allowed opacity-50'} w-[561px] bg-[#1DBF73] text-white py-2 rounded-lg font-semibold h-16 mt-4 shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]`}
          >
            Continue To Test →
          </button>
          {/* <button
            onClick={handleContinue}
            className={` w-[561px] bg-[#1DBF73] text-white py-2 rounded-lg font-semibold h-16 mt-4 shadow-[2.0px_3.0px_2.0px_rgba(0,0,0,0.1)]`}
          >
            Continue To Test →
          </button> */}
        </div>
}
      </div>
    </div>
    </>
  );
}

export default First;
