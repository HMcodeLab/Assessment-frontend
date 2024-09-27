import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { FaArrowLeft, FaGreaterThan, FaLessThan } from "react-icons/fa";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { json, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Modal from 'react-modal';
import { ImCross } from "react-icons/im";
import { BASE_URL } from "../../Api";
import Spinner from "../Spinner";
import Watermark from "../temp";
import html2canvas from 'html2canvas';
const base64ToBlob = (base64, contentType = 'image/jpeg') => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};
export default function NewQuestion() {
  const [enablefullscreen, setenablefullscreen] = useState(false)
  const [Selected, setSelected] = useState();
  const [data, setdata] = useState([]);
  const [show, setshow] = useState(false);
  const [params, setparams] = useSearchParams();
  const screenshotRef = useRef();
  const [personDetectionDisabled, setPersonDetectionDisabled] = useState(false);
  const [screenshots, setScreenshots] = useState(() => {
    const key = `screenshots${localStorage.getItem('assessmenttoken')}`;
    const storedScreenshots = localStorage.getItem(key);

    if (storedScreenshots) {
      // Convert base64 strings back to Blob objects if data exists
      const parsedScreenshots = JSON.parse(storedScreenshots);
      return parsedScreenshots.map(base64 => base64ToBlob(base64));
    }

    // If no screenshots found, initialize state with an empty array
    return [];
  });
  const [index, setindex] = useState(()=>{
    let storedindex=localStorage.getItem('lastindex'+localStorage.getItem('assessmenttoken'))
    return storedindex ? parseInt(storedindex) : 0;
  });
  const [audioAlert, setAudioAlert] = useState(false);
  const [tabwarning, settabwarning] = useState(0);
  let [peoplewarning, setpeoplewarning] = useState(
    ()=>{
      let storedindex=localStorage.getItem('warnings'+localStorage.getItem('assessmenttoken'))
      return storedindex ? parseInt(storedindex) : 3;
    }
  );
  let navigate = useNavigate();
  const [Length, setLength] = useState(0);
  const [camerablocked, setcamerablocked] = useState()
  let token = localStorage.getItem("USER");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const [micblocked, setmicblocked] = useState()
  const [showalert, setshowalert] = useState(true)
  const [assessmentname,setassessmentname]=useState()
const [ProctoringScore,setProctoringScore]=useState({
  "mic":0,
  "webcam":0,
  "TabSwitch":0,
  "multiplePersonInFrame":0,
  "PhoneinFrame":0,
  "ControlKeyPressed":0,
  "invisiblecam":0
})
const [proctoringActive, setProctoringActive] = useState({
  mic: false,
  webcam: false,
  TabSwitch: false,
  multiplePersonInFrame: false,
  PhoneinFrame: false,
  ControlKeyPressed: false,
  invisiblecam:false
});
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function enterFullScreen() {
  const element = document.documentElement; // or any specific element

  if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .then(() => {
          console.log("Entered full-screen mode successfully.");
          setenablefullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err.message);
        });
    } else if (element.webkitRequestFullscreen) { // For iOS and Safari

       
    } else {
      console.warn("Fullscreen API is not supported on this browser.");
      setenablefullscreen(true);

    }
  } else {
    console.warn("Fullscreen mode is not allowed.");
    setenablefullscreen(true);

  }
}


  async function Fetchdata() {
    try {
      let url = `${BASE_URL}/getAssesmentAllQuestions`;
      setshow(true);
      // setindex(params.get("index"))
      const data = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` ,
      "Content-Type": "application/json"},
      });
      const response = await data.json();
      if (response.success) {
        setshow(false);
        setassessmentname(response?.Assessment?.assessmentName)
        const newProctoringActive = {};

    Object.keys(response?.Assessment?.ProctoringFor).forEach(key => {
      newProctoringActive[key] = response?.Assessment?.ProctoringFor[key].inUse;
    });
// console.log(newProctoringActive);

    setProctoringActive(newProctoringActive);
    let checkdata=localStorage.getItem('data'+localStorage.getItem('assessmenttoken')) 
    if(checkdata){
      console.log(checkdata,JSON.parse(checkdata));
      
      setdata(JSON.parse(checkdata))
    }
    else{
      setdata(response?.questions);
    }
        
        setLength(response?.totalQuestions);
      } else {
        toast.success(response?.message)
        localStorage.removeItem('time'+localStorage.getItem('assessmenttoken'))
        // navigate("/submitted");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(enablefullscreen){
      Fetchdata();
    }
  }, [enablefullscreen]);
  // let tempdata=true;/
  // useEffect(() => {
  //   if(data.length){
  //     // tempdata=false;
  //     localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(data))
  //   }
  // }, [index])
   const loadModelAndDetect = async () => {
    const model = await cocoSsd.load();
    setcameraActive(true)
    setInterval(() => detectFrame(videoRef.current, model), 100);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
      
      loadModelAndDetect();
    
      setcamerablocked(false)
    } catch (err) {
      // console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setcamerablocked(true)
        captureScreenshot()
        openModal("You can't block the camera.Give access to camera manually")
        

        setProctoringScore(prevState => ({
          ...prevState,
          invisiblecam: prevState.invisiblecam + 1, 
        }));
        setpeoplewarning((prev)=>prev-1);

      }
    }
  };

  const detectFrame = async (video, model) => {
    if (video && video.readyState === 4) {
      const predictions = await model.detect(video);
      if (!personDetectionDisabled) {
        drawBoundingBoxes(predictions);
        checkForPhone(predictions);
        countPersons(predictions);
      }
    }
  };

  const drawBoundingBoxes = (predictions) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    predictions.forEach(prediction => {
      // console.log(prediction.class);
      
      if (prediction.class === 'person') {
        const [x, y, width, height] = prediction.bbox;
        // ctx.strokeStyle = 'red';
        ctx.lineWidth = 0;
        ctx.strokeRect(x, y, width, height);
        // ctx.fillStyle = 'red';
        ctx.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          x,
          y > 10 ? y - 5 : y + 10
        );
      }
    });
  };

  const countPersons = (predictions) => {
    const count = predictions.filter(prediction => prediction.class === 'person').length;
    setPersonCount(count);
  };
  const checkForPhone = (predictions) => {
    const phoneDetected = predictions.some(prediction => prediction.class === 'cell phone');
    setPhoneDetected(phoneDetected);
  };

  const handleSubmit = async () => {
    // try {
      // let url = `${BASE_URL}/submitAnswerForAssessment`;
      // setshow(true);
      // const data1 = await fetch(url, {
      //   method: "PUT",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     index:index+1,
      //     answer: Selected
          
      //   }),
      // });
      // const response = await data1.json();
      // if (response.success) {
        setdata((prevArr) => {
          const newArr = [...prevArr]; // Create a shallow copy of the array
          newArr[index] = { ...newArr[index], submittedAnswer: Selected,isSubmitted:true }; // Update the specific object
          localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(newArr))

          return newArr; // Set the updated array
        });
        localStorage.setItem('lastindex'+localStorage.getItem('assessmenttoken'),index+1)
        setshow(false);
        if(data[index+1]?.markForReview || data[index+1]?.isSubmitted){
          setSelected(data[index+1]?.submittedAnswer)
        }
        else{
          setSelected("");
        
        }

        if(index+1==Length){
          // handleClick(false,"")
          setindex(0)

          return;
        }

      
        setindex((prev)=>prev+1);
       
        // navigate(`/question?index=${index + 1}&t=${params.get('t')}`);
      
   
  };

  function Nextquestion() {
    if (index < Length) {
      // Fetchdata();
      setdata((prevArr) => {
        const newArr = [...prevArr]; // Create a shallow copy of the array
        newArr[index] = { ...newArr[index],isVisited:true }; // Update the specific object
        localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(newArr))

        return newArr; // Set the updated array
      });
      localStorage.setItem('lastindex'+localStorage.getItem('assessmenttoken'),index+1)
if(data[index]?.markForReview || data[index]?.isSubmitted){
  setSelected(data[index]?.submittedAnswer)
}
else{
  setSelected("");

}
      setindex((prev)=>prev+1);
      // navigate(`/question?index=${index + 1}&t=${params.get('t')}`);
    }
  }

  function Previousquestion() {
    if (index >= 1) {
      setdata((prevArr) => {
        const newArr = [...prevArr]; // Create a shallow copy of the array
        newArr[index] = { ...newArr[index],isVisited:true }; // Update the specific object
        localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(newArr))
        return newArr; // Set the updated array
      });
      localStorage.setItem('lastindex'+localStorage.getItem('assessmenttoken'),index-1)

      if(data[index-1]?.markForReview || data[index-1]?.isSubmitted){
        setSelected(data[index-1]?.submittedAnswer)
      }
      else{
        setSelected("");
      
      }
      setindex((prev)=>prev-1);
    }
  }

  async function handleClick(status,remarks) {
    // console.log(screenshots);
    setshow(true)
    let formdata=new FormData()
    formdata.append('isSuspended',status)
    formdata.append('ProctoringScore',JSON.stringify(ProctoringScore))
    formdata.append('remarks',remarks)
    const filteredQuestions = data
  .filter(question => question.isSubmitted) 
  .map((question, index) => ({
    index: index + 1,  
    answer: question.submittedAnswer  
  }));
  formdata.append('answers',JSON.stringify(filteredQuestions))
  // console.log(filteredQuestions);
  
    // const filesArray = [];
    screenshots.forEach((blob, index) => {
      const file = new File([blob], `screenshot_${index}.jpeg`, { type: 'image/jpeg' });
      formdata.append('userScreenshots', file);
    });
    try {
      let url = `${BASE_URL}/finishAssessment`;
      const data = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });
      const response = await data.json();
      if (response.success) {
        setshow(false)
        localStorage.removeItem(localStorage.getItem('assessmenttoken'))
    localStorage.clear();

        if(status){
          toast.error("Suspended!");
          window.location.replace('/suspended');
        }
        else{
          toast.success("Submitted Successfully");
          window.location.replace('/submitted');
        }
     
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const [audio] = useState(new Audio('/danger.mp3'));

  const [personCount, setPersonCount] = useState(-1);
  const [cameraActive, setcameraActive] = useState(false)
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [warning, setwarning] = useState('')
  const [phoneDetected, setPhoneDetected] = useState(false);
  const timerIntervalRef = useRef(null);
  const [timer, setTimer] = useState(() => {
    const storedTimer = localStorage.getItem('time'+localStorage.getItem('assessmenttoken'));
    return  parseInt(storedTimer);
  });
  const maxVolumeRef = useRef(0);
  const allowedwarnings = 3;
let tempstate=true;
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const startTimer = () => {
  // Check if there's already an interval running to prevent multiple intervals
  if (timerIntervalRef.current || !enablefullscreen) {
    return;
  }

  timerIntervalRef.current = setInterval(() => {
    setTimer((prevTimer) => {
      if (prevTimer <= 0) {
        clearInterval(timerIntervalRef.current); // Clear interval when timer reaches 0
        timerIntervalRef.current = null;
        captureScreenshot()
        openModal("Time's up");
        

        localStorage.removeItem('time'+localStorage.getItem('assessmenttoken'));
        handleClick(true, "Time's up");
        return 0;
      }
      localStorage.setItem('time'+localStorage.getItem('assessmenttoken'), prevTimer - 1);
      return prevTimer - 1;
    });
  }, 1000); // Update timer every second
};

useEffect(() => {
  // Start the timer only when enablefullscreen is true
  if (enablefullscreen) {
    startTimer();
  } else {
    // Pause timer if fullscreen is disabled
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }

  // Cleanup function to clear the interval when the component unmounts
  return () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
}, [enablefullscreen]);
useEffect(() => {
  const handleKeyDown = (event) => {
    const key = event.key;
    const isFunctionKey = key.startsWith('F') && key.length === 2; // Function keys (F1-F12)
    const isControlKey = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey; // Ctrl, Alt, Cmd, Shift

    if ((isFunctionKey || isControlKey) && peoplewarning>0 && showalert) {
      event.preventDefault(); // Prevent default behavior
      openModal("You are not allowed to press controll keys")
      setProctoringScore(prevState => ({
        ...prevState,
        ControlKeyPressed: prevState.ControlKeyPressed + 1, 
      }));
      captureScreenshot()
      setpeoplewarning((prev)=>prev-1);

    }
  };

  // Add the global keydown listener when the component mounts
  window.addEventListener('keydown', handleKeyDown);

  // Remove the listener when the component unmounts
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && proctoringActive.TabSwitch) {
        document.title = "Don't change the tab";
        if (peoplewarning > 0 && enablefullscreen ) {
          captureScreenshot()
          openModal('You are not allowed to change the tab.')
         

          setpeoplewarning((prev)=>prev-1);
          setProctoringScore(prevState => ({
            ...prevState,
            TabSwitch: prevState.TabSwitch + 1, 
          }));

          // enterFullScreen();
        }
        audio.play().catch(error => console.error('Error playing audio:', error));
      } else {
        document.title = 'Online Test';
        audio.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audio,peoplewarning,enablefullscreen,showalert]);




  useEffect(() => {
   

   if(enablefullscreen && proctoringActive.webcam){
    startCamera();
   }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [enablefullscreen,proctoringActive.webcam]);

  useEffect(() => {
    if (proctoringActive.multiplePersonInFrame && !personDetectionDisabled) {
      if (personCount > 1) {
        if (peoplewarning >= 0 && cameraActive && showalert) {
          captureScreenshot();
          openModal(`Warning!! ${personCount} Person Detected in your camera frame.`);
          
          setProctoringScore(prevState => ({
            ...prevState,
            multiplePersonInFrame: prevState.multiplePersonInFrame + 1,
          }));
          setpeoplewarning((prev) => prev - 1);
          setPersonCount(-1);
  
          // Disable person detection for 6 seconds after an alert is shown
          setPersonDetectionDisabled(true);
          setTimeout(() => {
            setPersonDetectionDisabled(false); // Enable detection again after 6 seconds
          }, 6000);
        }
      }
    }
  
    if (personCount === 0 && cameraActive && proctoringActive.webcam && proctoringActive.invisiblecam && !personDetectionDisabled) {
      if (peoplewarning >= 0 && showalert) {
        captureScreenshot();
        openModal(`Warning!! Your face should be clearly visible in front of the camera.`);
        
        setpeoplewarning((prev) => prev - 1);
        setPersonCount(-1);
        setProctoringScore(prevState => ({
          ...prevState,
          invisiblecam: prevState.invisiblecam + 1,
        }));
  
        // Disable person detection for 6 seconds after an alert is shown
        setPersonDetectionDisabled(true);
        setTimeout(() => {
          setPersonDetectionDisabled(false); // Enable detection again after 6 seconds
        }, 6000);
      }
    }
  }, [personCount, enablefullscreen, showalert, cameraActive]);

  useEffect(() => {
    localStorage.setItem('warnings'+localStorage.getItem('assessmenttoken'),peoplewarning)

      if (peoplewarning <0 && cameraActive && !camerablocked && !micblocked && enablefullscreen) {
        handleClick(true,'Cheating attempt detected during the online test. Disciplinary action will follow.');
      }
   
  }, [peoplewarning,enablefullscreen]);

  const handleAudioMonitoring = async () => {
    let temp=true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const detectVolume = () => {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const volume = dataArrayRef.current[0];
  
          // console.log("Current volume:", volume);
  
          if (volume > 200 && temp && showalert && peoplewarning>0) {
            captureScreenshot()
            openModal('You are not allowed to speak during the test.')
            

            temp=false;
            // console.log(peoplewarning-1);
            
            setpeoplewarning((prev)=>prev-1);
  
            // Stop the audio stream immediately
            stream.getTracks().forEach(track => track.stop());
            clearInterval(audioIntervalRef.current);
  
            // Reset the volume to 0 instantly
            dataArrayRef.current[0] = 0;
  
            // Restart audio monitoring after 2 seconds
            setTimeout(() => {
              handleAudioMonitoring();
            }, 5000);
          }
        };
  
        audioIntervalRef.current = setInterval(detectVolume, 1000);
        setmicblocked(false)
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          // setcamerablocked(true)
          setmicblocked(true)
          captureScreenshot()
          openModal("You can't block the microphone.Give access to microphone manually")
          setpeoplewarning((prev)=>prev-1);

          setProctoringScore(prevState => ({
            ...prevState,
            mic: prevState.mic + 1, 
          }));

        }
      }
    }
  };
  
  useEffect(() => {
   if(enablefullscreen && proctoringActive.mic && showalert){
    handleAudioMonitoring();
   }
    return () => clearInterval(audioIntervalRef.current);
  }, [enablefullscreen,proctoringActive,showalert]);

  useEffect(() => {
    if (phoneDetected && proctoringActive.PhoneinFrame && showalert && peoplewarning>0) {
      captureScreenshot()
      openModal("Phones are not allowed during test")
     

      setProctoringScore(prevState => ({
        ...prevState,
        PhoneinFrame: prevState.PhoneinFrame + 1, 
      }));
      setpeoplewarning((prev)=>prev-1);
    }
  }, [phoneDetected,enablefullscreen]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(data) {
    setIsOpen(true);
    setwarning(data)
    setshowalert(false)
  }

  function afterOpenModal() {
   
  }

  function closeModal() {
    setIsOpen(false);
    enterFullScreen()
    setshowalert(true)
  }
  useEffect(() => {
    const handleFullScreenChange = (e) => {
      if (!document.fullscreenElement && peoplewarning>0) {
        enterFullScreen()
        setpeoplewarning((prev)=>prev-1);
        openModal("You cant't exist full screen")
        setProctoringScore(prevState => ({
          ...prevState,
          TabSwitch: prevState.TabSwitch + 1, 
        }));
        captureScreenshot()

      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [enablefullscreen]);
  function handleQuestionNumber(ind){
    setdata((prevArr) => {
      const newArr = [...prevArr]; // Create a shallow copy of the array
      newArr[ind] = { ...newArr[ind],isVisited:true }; // Update the specific object
      localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(newArr))
      return newArr; // Set the updated array
    });
    localStorage.setItem('lastindex'+localStorage.getItem('assessmenttoken'),ind)

    setindex(ind)
    if(data[ind]?.markForReview || data[ind]?.isSubmitted){
      setSelected(data[ind]?.submittedAnswer)
    }
    else{
      setSelected("");
    
    }  }


  // Function to capture the screenshot and store it in the state
  const captureScreenshot = () => {
    const element = contentRef.current;

    html2canvas(element, {
      useCORS: true,
      scale: 1,
      height:window.innerHeight,
      width:window.innerWidth
    }).then(async (canvas) => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Convert Blob to base64
          const base64 = await blobToBase64(blob);
          const key = `screenshots${localStorage.getItem('assessmenttoken')}`;

          // Get the existing screenshots from localStorage
          const storedScreenshots = JSON.parse(localStorage.getItem(key)) || [];
          storedScreenshots.push(base64); // Add new base64 string

          // Update localStorage
          localStorage.setItem(key, JSON.stringify(storedScreenshots));

          // Update the state with the new Blob
          setScreenshots(prevScreenshots => [...prevScreenshots, blob]);
        }
      }, 'image/jpeg', 0.7);
    });
  };
  
  function handleMarkForReview(){
    setdata((prevArr) => {
      const newArr = [...prevArr]; // Create a shallow copy of the array
      newArr[index] = { ...newArr[index],markForReview:true,submittedAnswer:Selected }; // Update the specific object
      localStorage.setItem('data'+localStorage.getItem('assessmenttoken'),JSON.stringify(newArr))
      return newArr; // Set the updated array
    });
    setSelected("")
    if(index+1==Length){
      setindex(0)
      return;
    }
    setindex((prev)=>prev+1);

  }

  return (
    <>
    <div  onContextMenu={(e)=>e.preventDefault()} className="relative w-full h-screen xsm:h-full mx-auto ">
      {enablefullscreen?<Watermark />:''}
      <div ref={screenshotRef} className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white w-full overflow-hidden" >
    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Warning"
        style={{
          content: {
            width: window?.innerWidth<480 ? '300px' :'500px',
            margin: 'auto',
            padding: '20px',
            height:'100px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
    <div className="flex justify-between">
     <div>{warning}</div>
        <button onClick={closeModal}><ImCross /></button>
    </div>
      </Modal>
    <div>
    <Toaster toastOptions={{
         duration: 500,
      }} />
    {
      camerablocked ? <div className="flex justify-center w-full h-screen items-center font-semibold font-pop">If you want to continue the test then first turn on the camera. </div>
: micblocked ? <div className="flex justify-center w-full h-screen items-center font-semibold font-pop">If you want to continue the test then first turn on the microphone. </div> :
      <div className="px-[2%] space-y-5 py-2 bg-white" ref={contentRef}>

           <div className='fixed bottom-0 left-0 font-pop xsm:top-10 xsm:left-0'>
           <div className='relative'>
             <video playsInline controls={false} ref={videoRef} width="200" height="180" className='rounded-xl xsm:w-24 xsm:h-20' style={{ display: 'block' }} />
             <canvas ref={canvasRef} width="200" height="180" className='absolute top-0 xsm:w-24 xsm:h-20' />
           </div>
           
         </div>
      
     
   
      { enablefullscreen ? <div className="fixed bottom-2 left-[250px] flex items-center gap-5 xsm:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 h-10 w-10"></div>
            <p>Skipped</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#1DBF73] h-10 w-10"></div>
            <p>Attempted</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 h-10 w-10"></div>
            <p>Active Question</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-300 h-10 w-10"></div>
            <p>Unattempted</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 h-10 w-10"></div>
            <p>Mark For Review</p>
          </div>
        </div>:''}
        {
          !enablefullscreen ? <div className="flex justify-center items-center w-full h-full"><button className="bg-[#1DBF73] text-white rounded p-2" onClick={enterFullScreen}>Enable full screen to continue test</button></div>:
        <>
        <div className="flex justify-between items-center border p-3 rounded-lg font-pop xsm:flex-col xsm:gap-5" onContextMenu={(e)=>e.preventDefault()}>
          <div className=" bg-white p-2 rounded-lg shadow-md font-bold text-xl">
          Time Remaining: {formatTime(timer)}
          </div>
          <div className="font-semibold text-lg">
          {assessmentname}
          </div>
          <div className="flex items-center space-x-3">
            <FaLessThan
              className={`h-8 w-8 text-xs rounded-full bg-slate-300 p-2 ${index === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              onClick={() => (index > 0 ? Previousquestion() : "")}
            />
            <FaGreaterThan
              className={`h-8 w-8 text-xs rounded-full bg-slate-300 p-2 ${index+1 === Length ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              onClick={() => (index+1 < Length ? Nextquestion() : "")}
            />
          </div>
        </div>
        
        
        <div  className="flex justify-between h-[77vh] xsm:flex-col xsm:gap-5 font-pop xsm:h-auto">
      {   
      index+1<=Length?<>
      <div className="w-[45%] rounded-xl border max-h-[70%] shadow-xl xsm:w-full overflow-y-auto scrollbarnumber xsm:h-full">
            <div className="border-b-[2px] p-3 font-semibold">{data[index]?.module}</div>
            <div className="p-3 text-lg text-gray-700">Q:{index+1}{") "} {data[index]?.question}</div>
          </div>
          <div className="w-[35%] rounded-xl border min-h-full shadow-xl overflow-y-auto xsm:w-full xsm:min-h-[50vh] xsm:h-fit scrollbarnumber">
            <div className="border-b-[2px] p-3 font-semibold">Options</div>
            <div className="flex flex-col p-5 gap-y-5 ">
              {data[index]?.options && Object.entries(data[index]?.options).map(([key, value]) => (
                <label
                  key={key}
                  onClick={() => setSelected(key.toString())}
                  htmlFor={key.toString()}
                  className={`${Selected === key.toString()  ? "border-[#1DBF73]" : ""} flex p-3 border rounded-lg space-x-2 cursor-pointer`}
                >
                  <input
                    name="option"
                    id={key.toString()}
                    type="radio"
                    checked={Selected === key.toString()}
                    className="accent-[#1DBF73]"
                    readOnly
                  />
                  <p>{value}</p>
                </label>
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  className={`shadow-lg py-2 px-4 rounded-xl bg-[#1DBF73] text-white ${index === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  onClick={() => (index > 0 ? Previousquestion() : "")}
                >
                  Previous
                 
                </button>
                <button
                  className={`shadow-lg py-2 px-4 rounded-xl bg-[#1DBF73] text-white ${index+1 === Length ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  onClick={() => (index+1 < Length ? Nextquestion() : "")}
                >
                  Next
                 
                </button>
              
              </div>
              <div className="flex justify-end space-x-2">
              <button
                  className={`shadow-lg py-2 px-4 rounded-xl bg-[rgb(29,191,115)] text-white ${!Selected ? 'cursor-not-allowed opacity-50':''}`}
                  onClick={()=>Selected ? handleMarkForReview():''}
                >
                  Mark for review
                 
                </button>
                <button
                  className={`shadow-lg py-2 px-4 rounded-xl bg-blue-500 text-white ${!Selected ? 'cursor-not-allowed opacity-50':''}`}
                  onClick={() => Selected ? handleSubmit() : ""}
                >
                  {index+1==Length ? 'Save':'Save & Next'}
                 
                </button>
              
              </div>
            </div>
          </div>
          <div className="w-[15%] flex flex-col justify-between xsm:w-full">
        <div className="w-full flex flex-row flex-wrap h-fit max-h-[90%] overflow-y-auto gap-3 scrollbarnumber ">
                {
                  data?.map((item,ind)=>{
                    return(<>
                    <div onClick={()=>handleQuestionNumber(ind)} className={ `text-white  h-10 w-10 flex justify-center items-center cursor-pointer shadow-lg rounded  
                      ${
                        index==ind ? 'bg-yellow-400 border border-white':
                        !item?.isSubmitted && item?.markForReview ? 'bg-blue-600':
                        !item?.isSubmitted && !item.isVisited ? 'bg-gray-300':
                       item?.isSubmitted ? 'bg-[#1DBF73]' : 
                       'bg-red-500'
                       }`}>{ind+1}</div>
                    </>)
                  })
                }
                   
        </div>
        <div className="py-2 px-4 rounded-xl bg-[#1DBF73] text-white  text-center shadow-lg cursor-pointer xsm:mt-5" onClick={()=>handleClick(false,'')}>
          Submit
        </div>
        </div>
        </>:''
      }
      </div>
        </>
}
        {show && (
          <div className="w-full h-screen fixed top-0 left-0 bg-[#b4cca1] opacity-80">
            <Spinner />
          </div>
        )}
      </div>
      
}
</div>
</div>
</div>
    </>
  );
}