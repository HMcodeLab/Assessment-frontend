import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../Api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerificationForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [query,setquery]=useSearchParams()
  const [data, setdata] = useState()
  let assessmentToken= query.get('assessmenttoken')
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
setdata(response?.data)
setFutureDate(new Date(response?.data?.startDate))
localStorage.setItem('time'+assessmentToken,parseInt(response?.data?.timelimit)*60)
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
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (email) {
      const data=await fetch(BASE_URL+'/verifyUserAccessForAssessment?assessmentToken='+assessmentToken+'&email='+email)
      const response=await data.json()
      // console.log(response);
      if(response?.success){
        toast.success(response?.msg)
        localStorage.setItem('USER',response.token)
        navigate('/hardwarechecking')
      }
      else{
        toast.error(response?.message)
      }
    } else {
      // alert('Please enter a valid email.');
      toast.error('Please enter a valid email.')
    }
  };
 
  
  return (<>
  <Toaster/>
 {/* {futureDate ? <div className='flex justify-center w-full text-2xl items-center gap-2'>Test will start in <p className='text-5xl font-bold'>{formatTime(timer)}</p></div>:''} */}
    <div className="min-h-screen flex justify-center items-center ">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Email
        </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-transparent transition duration-200"
                placeholder="Enter your registered email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 bg-white px-1 text-gray-500 text-sm"
              >
                Email Address
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // className={`${timer!=0 ? 'cursor-not-allowed pointer-events-none opacity-50':''} w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-300`}
              className={` w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-300`}
           
           >
              Verify Email
            </button>
          </form>
      </div>
    </div>
    </>  );
};

export default EmailVerificationForm;
