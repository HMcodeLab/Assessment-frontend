import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../../../Api";

const DeviceCheckPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  let assessmentToken=localStorage.getItem('assessmenttoken')
  const [search,setserch]=useSearchParams()
  const [Proctoringdata, setProctoringdata] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({
    1: 0, 
    2: 0,
    3: 0,
  });

  const [show, setshow] = useState(false);
  const [isProtected, setisProtected] = useState(()=>{
    let stored=localStorage.getItem('protected'+localStorage.getItem('assessmenttoken'))
    return stored ? stored : true;
  })
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [microphoneError, setMicrophoneError] = useState('');
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [time, settime] = useState()
  const [micworking, setmicworking] = useState(false)
  const [cameraworking, setcameraworking] = useState(false)
const navigate=useNavigate()
  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play();
      }
      streamRef.current = cameraStream;
      setcameraworking(true)
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
      toast.error('Could not access camera. Please check permissions')
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        toast.error("Camera access denied. Please allow camera access.");
      }
    }
  };

  const startMicrophone = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      visualizeMicrophone();

      streamRef.current = audioStream;
      setmicworking(true)
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicrophoneError("Could not access microphone. Please check permissions.");
      toast.error('Could not access microphone. Please check permissions')
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        toast.error("Microphone access denied. Please allow microphone access.");
      }
    }
  };

  const visualizeMicrophone = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };


  const enterFullScreen = () => {
    if (document.fullscreenEnabled) {
      const element = document.documentElement; // or any specific element
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err.message);
        });
      } else {
        console.warn("Fullscreen API is not supported on this browser.");
      }
    } else {
      console.warn("Fullscreen mode is not allowed.");
    }
  };
  async function handleContinue(){
    let token = localStorage.getItem("USER");
    try {
      let url = BASE_URL + "/StartAssessment"
        const data = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const response=await data.json()
      if(response.success){
        if(isProtected){
        window.location.replace(`/question`)

        }
        else{
        window.location.replace(`/nmquestion`)

        }
      }
      else{
        toast.error(response.message)
      }
    } catch (error) {
      
    }
  }
  useEffect(() => {
    async function Fetchdata() {
      try {
        // setshow(true);
        // let url = BASE_URL + "/getUserAssessment?assessmentToken="+localStorage.getItem('assessmenttoken')
        // const data = await fetch(url)
        // const response = await data.json();
        // settime(response?.data?.timelimit)
        // setisProtected(response?.data?.isProtected)
        // setProctoringdata(response?.data?.ProctoringFor)
        // setshow(false)
await startCamera()
await startMicrophone()
      } catch (error) {
        console.log(error);
      }
    }
    Fetchdata();
    

  }, []);





  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const totalOptions = 3;
  const percentage = (selectedOptions[currentStep] / totalOptions) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-4 space-y-4">
          <div className="flex items-center p-4 border rounded-lg shadow-md">
                <div className="flex-shrink-0 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 10h6m4 0h4m-8 6h4m-6 0h2m-6-6h2m8 6h2m-6-6h4m0 0V6m0 4h-4m4 0h4m-4 0v6m0 0h4"
                    />
                  </svg>
                </div>
                <p className="flex-1">Microphone</p>
               {!micworking ? <button onClick={()=>startMicrophone()}>Verify</button> :  <div className="flex items-center text-green-600">Verified <MdOutlineDone className="bg-black text-white rounded-full h-5 w-5 ml-2"/></div>}
              </div>
          <div className="flex items-center p-4 border rounded-lg shadow-md">
                <div className="flex-shrink-0 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 10h6m4 0h4m-8 6h4m-6 0h2m-6-6h2m8 6h2m-6-6h4m0 0V6m0 4h-4m4 0h4m-4 0v6m0 0h4"
                    />
                  </svg>
                </div>
                <p className="flex-1">Camera</p>
                {!cameraworking ? <button onClick={startCamera}>Verify</button> : <div className="flex items-center text-green-600">Verified <MdOutlineDone className="bg-black text-white rounded-full h-5 w-5 ml-2"/></div>}

              </div>

          </div>
        );

      default:
        return null;
    }
  };
 
  return (<>
  <Toaster/>

    <div className="max-w-full h-full mx-auto p-4 md:p-8 py-8">
      <div className="bg-white rounded-lg shadow-lg  flex  justify-between xsm:flex-col">
        <div className=" p-6 bg-gray-100 flex flex-col justify-center items-center gap-5 ">

                <video  ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }} />
                <canvas  ref={canvasRef}  style={{width: '100%', maxWidth: '400px',marginTop: '20px'}}></canvas>
        </div>

        <div className=" p-6 bg-white  w-full ">

          <div className="py-4">{renderStepContent()}</div>
         {(micworking && cameraworking )? <div className="flex justify-center w-full"><button className="bg-green-500 text-white rounded p-2 " onClick={handleContinue}>Continue test</button></div> : ''}
<div className="font-semibold mt-5">Note : If it doesn't verify your camera or microphone automatically then do it manually by clicking on verify button. </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default DeviceCheckPage;
