import { MdEmail, MdPhone } from 'react-icons/md';
import { FaPhoneAlt } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from "../../Api";
import Spinner from '../Spinner';
// Instructions Component
const Instructions = ({handleSubmit}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 59, seconds: 1 });

  

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <h1 className="text-2xl font-bold mb-4">Instructions Before Doing The Test</h1>
            <div className="overflow-y-auto flex-grow">


                <div className="mb-4 pr-4">
                    <h2 className="text-xl font-semibold mb-2">Online Test Instructions for AI-Proctored PAP Test</h2>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Getting Ready:</h3>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Ensure you have a working webcam and microphone connected to your computer.</li>
                        <li>Find a quiet, well-lit room with a clean desk/table to take the test.</li>
                        <li>Close all other programs and browsers before starting the test.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Launching the Test:</h3>
                    <ol className="list-decimal pl-5 mb-4">
                        <li>Log into the test portal using the provided credentials.</li>
                        <li>Follow the instructions to launch the AI proctoring software</li>
                    </ol>

                    <h3 className="text-lg font-semibold mt-4 mb-2">During the Test:</h3>
                    <ol className="list-decimal pl-5 mb-4">
                        <li>The AI proctor will continuously monitor you via webcam and microphone.</li>
                        <li>Do not leave the testing area or have unauthorized materials/devices nearby.</li>
                        <li>The AI will flag any suspicious behaviour for review</li>
                    </ol>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Alerts:</h3>
                    <ul className="list-disc pl-5 mb-4">
                        <li><strong>3 Times Alert:</strong> If you leave the testing area or look away from the screen for an extended period, you will receive an alert.</li>
                        <li><strong>2 Person Alert:</strong> If the AI detects a second person in the testing area, you will receive an alert.</li>
                        <li><strong>Tab Change Alert:</strong> If you switch tabs or windows during the test, you will receive an alert.</li>
                        <li><strong>New Window Alert:</strong> If you open a new window during the test, you will receive an alert.</li>
                        <li><strong>Block User Alert:</strong> After 3 alerts for leaving the testing area or looking away, you will be blocked from continuing the test.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Submitting the Test:</h3>
                    <ol className="list-decimal pl-5 mb-4">
                        <li>Once complete, click "Submit Test" and follow any additional instructions.</li>
                        <li>The AI proctor recording will be reviewed to ensure test integrity.</li>
                    </ol>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="agreement"
                        className="mr-2 h-4 w-4 text-[rgba(29,191,115,1)] focus:ring-[rgba(29,191,115,1)] border-gray-300 rounded"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <label htmlFor="agreement" className="text-sm text-gray-700">
                        I declare that I have read and understood the instructions, and I agree to abide by the rules.
                    </label>
                </div>
            </div>

            <button
                className={`w-full py-3 rounded-lg text-white font-bold ${isChecked ? 'bg-[rgba(29,191,115,1)] hover:[rgba(29,191,115,1)]' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!isChecked}
                onClick={handleSubmit}
            >
                Ready To Begin
            </button>
        </div>
    );
};

// Assessment Component
const AssessmentPage = ({ onContinue,data }) => {
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-semibold  mb-4">Welcome</h1>
                <h2 className="text-2xl font-bold text-[36px] mb-2">
                    It's Time To Complete Your
                </h2>
                <h3 className="mt-0 text-[40px] text-[rgba(29,191,115,1)] font-poppins">
                    {data?.assessmentName}
                </h3>


                <form className="space-y-6">
                    <div>
                        <label className="block font-Poppins">Name</label>
                        <input
                            readOnly
                            value={data?.userAccess?.name}
                            className="w-full border-b border-gray-300 rounded-none p-0 focus:outline-none focus:border-b-[rgba(29,191,115,1)]"

                        />
                    </div>

                    <div>
                        <label className="block font-Poppins">Phone Number</label>
                        <input
                            readOnly
                            value={data?.userAccess?.phone_number}
                            className="w-full border-b border-gray-300 rounded-none p-0 focus:outline-none focus:border-b-[rgba(29,191,115,1)]"
                        />
                    </div>

                    <div>
                        <label className="block font-Poppins">College Name</label>
                        <input
                             readOnly
                             value={data?.userAccess?.college_name}
                            className="w-full border-b border-gray-300 rounded-none p-0 focus:outline-none focus:border-b-[rgba(29,191,115,1)]"
                        />
                    </div>

                    <div>
                        <label className="block font-Poppins ">Email</label>
                        <input
                             readOnly
                             value={data?.userAccess?.email}
                            className="w-full border-b border-gray-300 rounded-none p-0 focus:outline-none focus:border-b-[rgba(29,191,115,1)]"
                        />
                    </div>

                </form>
            </div>

            <div className="flex">
                <button
                    type="button"
                    className={`bg-[rgba(29,191,115,1)] text-white px-6 py-2 rounded-lg h-[60px] w-[575px] ${new Date() > new Date(data?.startDate) && new Date() < new Date(data?.lastDate)? '':'cursor-not-allowed opacity-50'}`} // Set a fixed width
                    onClick={()=>new Date() > new Date(data?.startDate) && new Date() < new Date(data?.lastDate) ? onContinue():''}
                >
                    Continue To Test
                    <span className="ml-2">→</span>
                </button>
            </div>


        </div>
    );
};

// Parent Component for merging both
const TestApp = () => {
    const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
const [show, setshow] = useState(false)
    const handleContinue = () => {
        setIsAssessmentComplete(true);
    };
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [query,setquery]=useSearchParams()
    const [data, setdata] = useState()
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
  const [futureDate, setFutureDate] = useState(new Date());
  
    // Timer state
    const [timer, setTimer] = useState(0);
    const timerIntervalRef = useRef(null);
  let temp=true;
  useEffect(() => {
  
  async function Fetchdata() {
    try {
        setshow(true)
      const data=await fetch(BASE_URL+'/getUserAssessment?assessmentToken='+assessmentToken)
      const response=await data.json();
      if(response.success){
        localStorage.setItem('time'+assessmentToken,parseInt(response?.data?.timelimit)*60)
        localStorage.setItem('protected'+assessmentToken,response?.data?.isProtected)
  setdata(response?.data)
  setFutureDate(new Date(response?.data?.startDate))
  setshow(false)
      }
    } catch (error) {
      
    }
  }
  if(temp){
    Fetchdata()
    temp=false;
  }
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
    return (
        <div className="min-h-screen bg-[rgba(29,191,115,1)] flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg flex xsm:flex-col lg:flex-row overflow-hidden">

                {/* Left Section */}
                <div className="w-full lg:w-1/3 bg-[rgba(29,191,115,0.25)] p-8 flex flex-col justify-between">
                   
                    {

                        timer!==0 ?  <div>
                        <h2 className="text-lg  mb-4 text-center font-Poppins text-[rgba(0,0,0,1)]">Your Test Will Be Live in</h2>
                        <div
                            className="bg-black text-white text-center rounded-lg w-fit mx-auto height-Hug[134.66px]  p-6 mb-8"
                            style={{
                                boxShadow: '0 10px 30px rgba(128, 0, 128, 1), 0 15px 45px rgba(255, 255, 255, 0)',
                            }}
                        >
                            <div className="flex gap-2 justify-center space-x-2 text-2xl font-bold">
                            {!show ? formatTime(timer):''}

                            </div>
                        </div>

                    </div>:
                     new Date() > new Date(data?.lastDate) ?

<div>
<h2 className="text-lg  mb-4 text-center font-Poppins text-[rgba(0,0,0,1)]"> Your test has been expired on</h2>
<div
    className="bg-black text-white text-center rounded-lg w-fit mx-auto height-Hug[134.66px]  p-6 mb-8"
    style={{
        boxShadow: '0 10px 30px rgba(128, 0, 128, 1), 0 15px 45px rgba(255, 255, 255, 0)',
    }}
>
    <div className="flex gap-2 justify-center space-x-2 text-2xl font-bold">
    { formatDate(data?.lastDate)}

    </div>
</div>

</div>:<div>
<h2 className="text-lg  mb-4 text-center font-Poppins text-[rgba(0,0,0,1)]">  Your Test Will End On</h2>
<div
    className="bg-black text-white text-center rounded-lg w-fit mx-auto height-Hug[134.66px]  p-6 mb-8"
    style={{
        boxShadow: '0 10px 30px rgba(128, 0, 128, 1), 0 15px 45px rgba(255, 255, 255, 0)',
    }}
>
    <div className="flex gap-2 justify-center space-x-2 text-2xl font-bold">
    {!show ? formatDate(data?.lastDate):''}

    </div>
</div>

</div>
                    }
                  

                    <div className="text-center text-black">
                        <img src="/image/log.png" alt="Hoping Minds Logo" className="w-[189px] h-[73.16px] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold font-poppins mb-4 text-[24px]">Contact Us For Support</h3>
                        <div className="flex items-center mb-2">
                            <MdEmail className="text-[rgba(60,60,60,1)] mr-2" size={20} /> {/* Email icon */}
                            <p className="font-poppins text-[rgba(60,60,60,1)]">support@hopingminds.com</p>
                        </div>
                        <div className="flex items-center">
                            <MdPhone className="text-[rgba(60,60,60,1)] mr-2" size={20} /> {/* Phone icon */}
                            <p className="font-poppins text-[rgba(60,60,60,1)]">90560-22600, 9139100050</p>
                        </div>

                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-2/3 p-8 h-[600px] overflow-y-auto">
                    {!isAssessmentComplete ? (
                        <AssessmentPage onContinue={handleContinue} data={data}/>
                    ) : (
                        <Instructions handleSubmit={handleSubmit}/>
                    )}
                </div>
            </div>
            {show && (
          <div className="w-full h-screen fixed top-0 left-0 bg-[#b4cca1] opacity-80">
            <Spinner />
          </div>
        )}
        </div>
    );
};

export default TestApp;