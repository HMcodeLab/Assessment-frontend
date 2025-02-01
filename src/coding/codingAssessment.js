import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { FaArrowLeft, FaGreaterThan, FaLessThan } from "react-icons/fa";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { json, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Modal from "react-modal";
import { ImCross } from "react-icons/im";
import { BASE_URL } from "../Api";
// import Spinner from "./Spinner/index/";
import { SlRefresh } from "react-icons/sl";
import html2canvas from "html2canvas";
import Watermark from "./temp";
import { MdDone } from "react-icons/md";
import CodeEditor from "./codeEditor";
import Spinner from "./Spinner/Spinner";
const base64ToBlob = (base64, contentType = "image/jpeg") => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};
export default function CodingAssessment() {
  const [enablefullscreen, setenablefullscreen] = useState(false);
  const [showtimer, setshowtimer] = useState(true);
  const [Selected, setSelected] = useState();
  const [data, setdata] = useState([]);
  const [show, setshow] = useState(false);
  const [params, setparams] = useSearchParams();
  const screenshotRef = useRef();
  const [personDetectionDisabled, setPersonDetectionDisabled] = useState(false);
  const [screenshots, setScreenshots] = useState(() => {
    const key = `screenshots${localStorage.getItem("assessmenttoken")}`;
    const storedScreenshots = localStorage.getItem(key);

    if (storedScreenshots) {
      // Convert base64 strings back to Blob objects if data exists
      const parsedScreenshots = JSON.parse(storedScreenshots);
      return parsedScreenshots?.map((base64) => base64ToBlob(base64));
    }

    // If no screenshots found, initialize state with an empty array
    return [];
  });
  const [index, setindex] = useState(() => {
    let storedindex = localStorage.getItem(
      "lastindex" + localStorage.getItem("assessmenttoken")
    );
    return storedindex ? parseInt(storedindex) : 0;
  });
  const [audioAlert, setAudioAlert] = useState(false);
  const [tabwarning, settabwarning] = useState(0);
  let [peoplewarning, setpeoplewarning] = useState(() => {
    let storedindex = localStorage.getItem(
      "warnings" + localStorage.getItem("assessmenttoken")
    );
    return storedindex ? parseInt(storedindex) : 3;
  });
  let navigate = useNavigate();
  const [Length, setLength] = useState(0);
  const [camerablocked, setcamerablocked] = useState();
  let token = localStorage.getItem("USER");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const [micblocked, setmicblocked] = useState();
  const [showalert, setshowalert] = useState(true);
  const [assessmentname, setassessmentname] = useState();
  const [allquestions, setallquestions] = useState([]);
  const [currentindex, setcurrentindex] = useState(0);
  const [testcaseindex, settestcaseindex] = useState(0);
  const [output, setoutput] = useState([]);
  const [compiledcode, setcompiledcode] = useState("");
  const [language, setlanguage] = useState("javascript");
  const [showSpinner, setshowSpinner] = useState(false);
  const [ProctoringScore, setProctoringScore] = useState({
    mic: 0,
    webcam: 0,
    TabSwitch: 0,
    multiplePersonInFrame: 0,
    PhoneinFrame: 0,
    ControlKeyPressed: 0,
    invisiblecam: 0,
  });
  const [proctoringActive, setProctoringActive] = useState({
    mic: false,
    webcam: false,
    TabSwitch: false,
    multiplePersonInFrame: false,
    PhoneinFrame: false,
    ControlKeyPressed: false,
    invisiblecam: false,
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
        element
          .requestFullscreen()
          .then(() => {
            console.log("Entered full-screen mode successfully.");
            setenablefullscreen(true);
          })
          .catch((err) => {
            console.error(
              "Error attempting to enable full-screen mode:",
              err.message
            );
          });
      } else if (element.webkitRequestFullscreen) {
        // For iOS and Safari
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
      let url = `${BASE_URL}/getAllCodingAssesmentQuestions`;

      setshow(true);
      const data = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();

      if (response.success) {
        setshow(false);
        setassessmentname(response?.Assessment?.assessmentName);

        const newProctoringActive = {};
        Object.keys(response?.Assessment?.ProctoringFor).forEach((key) => {
          newProctoringActive[key] =
            response?.Assessment?.ProctoringFor[key].inUse;
        });
        setProctoringActive(newProctoringActive);

        // console.log("API Response:", response);
        // console.log("Problems:", response?.problems);

        if (response.problems && Array.isArray(response.problems)) {
          setdata(response);
          setallquestions(response.problems);
        } else {
          console.error("Invalid problem data structure:", response.problems);
        }

        let checkdata = localStorage.getItem(
          "data" + localStorage.getItem("assessmenttoken")
        );
        if (checkdata) {
          let parsed = JSON.parse(checkdata);
          console.log("Problem data is coming", response?.problems);
          setdata(parsed);
          setcompiledcode(
            response?.problems[currentindex]?.problem?.initial_user_func[
              language
            ]?.initial_code
          );
        } else {
          setcompiledcode(
            response?.problems[currentindex]?.problem?.initial_user_func[
              language
            ]?.initial_code
          );
        }

        setLength(response?.total_problem);
      } else {
        setshowtimer(false);
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // async function Fetchdata() {
  //   try {
  //     let url = `${BASE_URL}/getAllCodingAssesmentQuestions`;

  //     setshow(true);
  //     // setindex(params.get("index"))
  //     const data = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const response = await data.json();
  //     if (response.success) {
  //       setshow(false);
  //       setassessmentname(response?.Assessment?.assessmentName);
  //       const newProctoringActive = {};

  //       Object.keys(response?.Assessment?.ProctoringFor).forEach((key) => {
  //         newProctoringActive[key] =
  //           response?.Assessment?.ProctoringFor[key].inUse;
  //       });
  //       console.log("hello checkdata", newProctoringActive);

  //       setProctoringActive(newProctoringActive);
  //       let checkdata = localStorage.getItem(
  //         "data" + localStorage.getItem("assessmenttoken")
  //       );
  //       if (checkdata) {
  //         // console.log(checkdata,JSON.parse(checkdata));
  //         let parsed = JSON.parse(checkdata);
  //         console.log("problem data is comming ",response.problems);

  //         setdata(JSON.parse(checkdata));
  //         setcompiledcode(
  //           response?.problems[currentindex]?.problem?.initial_user_func[
  //             language
  //           ]?.initial_code
  //         );
  //       } else {
  //         setdata(response);
  //         setallquestions(response?.problems);
  //         // console.log("starting",response?.problems[currentindex]?.problem?.initial_user_func[language]?.initial_code);

  //         setcompiledcode(
  //           response?.problems[currentindex]?.problem?.initial_user_func[
  //             language
  //           ]?.initial_code
  //         );
  //       }

  //       setLength(response?.total_problem);
  //     } else {
  //       setshowtimer(false);
  //       toast.error(response?.message);
  //       // localStorage.removeItem('time'+localStorage.getItem('assessmenttoken'))
  //       // navigate("/submitted");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    if (enablefullscreen) {
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
    setcameraActive(true);
    setInterval(() => detectFrame(videoRef.current, model), 100);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current
        .play()
        .catch((err) => console.error("Error playing video:", err));

      loadModelAndDetect();

      setcamerablocked(false);
    } catch (err) {
      // console.error('Error accessing camera:', err);
      if (err.name === "NotAllowedError" || err.name === "NotFoundError") {
        setcamerablocked(true);
        captureScreenshot();
        openModal("You can't block the camera.Give access to camera manually");

        setProctoringScore((prevState) => ({
          ...prevState,
          invisiblecam: prevState.invisiblecam + 1,
        }));
        setpeoplewarning((prev) => prev - 1);
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
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    predictions.forEach((prediction) => {
      // console.log(prediction.class);

      if (prediction.class === "person") {
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
    const count = predictions.filter(
      (prediction) => prediction.class === "person"
    ).length;
    setPersonCount(count);
  };
  const checkForPhone = (predictions) => {
    const phoneDetected = predictions.some(
      (prediction) => prediction.class === "cell phone"
    );
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
      newArr[index] = {
        ...newArr[index],
        submittedAnswer: Selected,
        isSubmitted: true,
      }; // Update the specific object
      if (index + 1 < Length) {
        newArr[index + 1] = { ...newArr[index + 1], isVisited: true }; // Update the specific object
      }
      localStorage.setItem(
        "data" + localStorage.getItem("assessmenttoken"),
        JSON.stringify(newArr)
      );

      return newArr; // Set the updated array
    });
    setshow(false);
    if (data[index + 1]?.markForReview || data[index + 1]?.isSubmitted) {
      setSelected(data[index + 1]?.submittedAnswer);
    } else {
      setSelected("");
    }

    if (index + 1 == Length) {
      // handleClick(false,"")
      setindex(0);
      localStorage.setItem(
        "lastindex" + localStorage.getItem("assessmenttoken"),
        index
      );

      return;
    }

    localStorage.setItem(
      "lastindex" + localStorage.getItem("assessmenttoken"),
      index + 1
    );
    setindex((prev) => prev + 1);

    // navigate(`/question?index=${index + 1}&t=${params.get('t')}`);
  };

  // async function handleClick(status, remarks) {
  //   setshow(true);

  //   // Prepare the data in the required format
  //   const data = {
  //     isSuspended: status,
  //     remarks: remarks,
  //     submissionTime: Math.floor(timer / 60),
  //     ProctoringScore: {
  //       mic: 85,
  //       webcam: 90,
  //       TabSwitch: 5,
  //       multiplePersonInFrame: 0,
  //       PhoneinFrame: 0,
  //       SoundCaptured: 10,
  //     },
  //   };

  //   // Add the screenshots if they exist
  //   const formData = new FormData();
  //   screenshots?.forEach((blob, index) => {
  //     const file = new File([blob], `screenshot_${index}.jpeg`, {
  //       type: "image/jpeg",
  //     });
  //     formData.append("userScreenshots", file);
  //   });

  //   try {
  //     let url = `${BASE_URL}/finishCodingAssessment`;

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (result?.success) {
  //       setshow(false);
  //       localStorage.setItem(
  //         "warnings" + localStorage.getItem("assessmenttoken"),
  //         3
  //       );
  //       localStorage.removeItem(
  //         "screenshots" + localStorage.getItem("assessmenttoken")
  //       );

  //       if (status) {
  //         toast.error("Suspended!");
  //         window.location.replace("/suspended");
  //       } else {
  //         toast.success("Submitted Successfully");
  //         window.location.replace("/submitted");
  //       }
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred");
  //   }
  // }

  async function handleClick(status, remarks) {
    // console.log(screenshots);
    setshow(true);
    let formdata = new FormData();
    formdata.append("isSuspended", status);
    formdata.append("ProctoringScore", JSON.stringify(ProctoringScore));
    formdata.append("remarks", remarks);
    formdata.append("submissionTime", timer / 60);
    // formdata.append('lastindex',index)

    // console.log(filteredQuestions);

    const filesArray = [];
    screenshots.forEach((blob, index) => {
      const file = new File([blob], `screenshot_${index}.jpeg`, {
        type: "image/jpeg",
      });
      formdata.append("userScreenshots", file);
    });
    try {
      let url = `${BASE_URL}/finishCodingAssessment`;

      // Create form data
      let formdata = new FormData();
      formdata.append("isCodingAssessmentSuspended", false);
      formdata.append("remarks", "This is the remark for the assessment");
      formdata.append("submissionTime", 345);
      formdata.append(
        "ProctoringScore",
        JSON.stringify({
          mic: 85,
          webcam: 90,
          TabSwitch: 5,
          multiplePersonInFrame: 0,
          PhoneinFrame: 0,
          SoundCaptured: 10,
        })
      );

      const data = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      const response = await data.json();
      if (response.success) {
        setshow(false);

        if (status) {
          toast.error("Suspended!");
          localStorage.setItem(
            "warnings" + localStorage.getItem("assessmenttoken"),
            3
          );
          localStorage.removeItem(
            "screenshots" + localStorage.getItem("assessmenttoken")
          );
          window.location.replace("/suspended");
        } else {
          localStorage.setItem(
            "warnings" + localStorage.getItem("assessmenttoken"),
            3
          );
          localStorage.removeItem(
            "screenshots" + localStorage.getItem("assessmenttoken")
          );
          toast.success("Submitted Successfully");
          window.location.replace("/submitted");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const [audio] = useState(new Audio("/danger.mp3"));

  const [personCount, setPersonCount] = useState(-1);
  const [cameraActive, setcameraActive] = useState(false);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [warning, setwarning] = useState("");
  const [phoneDetected, setPhoneDetected] = useState(false);
  const timerIntervalRef = useRef(null);
  const [timer, setTimer] = useState(() => {
    const storedTimer = localStorage.getItem(
      "time" + localStorage.getItem("assessmenttoken")
    );
    return parseInt(storedTimer);
  });
  const maxVolumeRef = useRef(0);
  const allowedwarnings = 3;
  let tempstate = true;
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const startTimer = () => {
    // Check if there's already an interval running to prevent multiple intervals
    if (timerIntervalRef.current || !enablefullscreen || !showtimer) {
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(timerIntervalRef.current); // Clear interval when timer reaches 0
          timerIntervalRef.current = null;
          captureScreenshot();
          openModal("Time's up");

          localStorage.removeItem(
            "time" + localStorage.getItem("assessmenttoken")
          );
          handleClick(false, "Time's up");
          return 0;
        }
        localStorage.setItem(
          "time" + localStorage.getItem("assessmenttoken"),
          prevTimer - 1
        );
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
  }, [enablefullscreen, showtimer]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const isFunctionKey = key.startsWith("F") && key.length === 2; // Function keys (F1-F12)
      const isControlKey =
        event.ctrlKey || event.altKey || event.metaKey || event.shiftKey; // Ctrl, Alt, Cmd, Shift
      // console.log(proctoringActive);

      if (
        (isFunctionKey || isControlKey) &&
        peoplewarning > 0 &&
        showalert &&
        proctoringActive.ControlKeyPressed
      ) {
        event.preventDefault(); // Prevent default behavior
        openModal("You are not allowed to press controll keys");
        setProctoringScore((prevState) => ({
          ...prevState,
          ControlKeyPressed: prevState.ControlKeyPressed + 1,
        }));
        captureScreenshot();
        setpeoplewarning((prev) => prev - 1);
      }
    };

    // Add the global keydown listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove the listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [proctoringActive.ControlKeyPressed]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && proctoringActive.TabSwitch) {
        document.title = "Don't change the tab";
        if (peoplewarning > 0 && enablefullscreen) {
          captureScreenshot();
          openModal("You are not allowed to change the tab.");

          setpeoplewarning((prev) => prev - 1);
          setProctoringScore((prevState) => ({
            ...prevState,
            TabSwitch: prevState.TabSwitch + 1,
          }));

          // enterFullScreen();
        }
        // audio.play().catch(error => console.error('Error playing audio:', error));
      } else {
        document.title = "Online Test";
        // audio.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [audio, peoplewarning, enablefullscreen, showalert]);

  useEffect(() => {
    if (enablefullscreen && proctoringActive.webcam) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enablefullscreen, proctoringActive.webcam]);

  useEffect(() => {
    if (proctoringActive.multiplePersonInFrame && !personDetectionDisabled) {
      if (personCount > 1) {
        if (peoplewarning >= 0 && cameraActive && showalert) {
          captureScreenshot();
          openModal(
            `Warning!! ${personCount} Person Detected in your camera frame.`
          );

          setProctoringScore((prevState) => ({
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

    if (
      personCount === 0 &&
      cameraActive &&
      proctoringActive.webcam &&
      proctoringActive.invisiblecam &&
      !personDetectionDisabled
    ) {
      if (peoplewarning >= 0 && showalert) {
        captureScreenshot();
        openModal(
          `Warning!! Your face should be clearly visible in front of the camera.`
        );

        setpeoplewarning((prev) => prev - 1);
        setPersonCount(-1);
        setProctoringScore((prevState) => ({
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
    localStorage.setItem(
      "warnings" + localStorage.getItem("assessmenttoken"),
      peoplewarning
    );

    if (
      peoplewarning < 0 &&
      cameraActive &&
      !camerablocked &&
      !micblocked &&
      enablefullscreen
    ) {
      handleClick(
        true,
        "Cheating attempt detected during the online test. Disciplinary action will follow."
      );
    }
  }, [peoplewarning, enablefullscreen]);

  const handleAudioMonitoring = async () => {
    let temp = true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount
        );

        const detectVolume = () => {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const volume = dataArrayRef.current[0];

          // console.log("Current volume:", volume);

          if (volume > 200 && temp && showalert && peoplewarning > 0) {
            captureScreenshot();
            openModal("You are not allowed to speak during the test.");
            setProctoringScore((prevState) => ({
              ...prevState,
              mic: prevState.mic + 1,
            }));

            temp = false;
            // console.log(peoplewarning-1);

            setpeoplewarning((prev) => prev - 1);

            // Stop the audio stream immediately
            stream.getTracks().forEach((track) => track.stop());
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
        setmicblocked(false);
      } catch (err) {
        if (err.name === "NotAllowedError" || err.name === "NotFoundError") {
          // setcamerablocked(true)
          setmicblocked(true);
          captureScreenshot();
          openModal(
            "You can't block the microphone.Give access to microphone manually"
          );
          setpeoplewarning((prev) => prev - 1);

          setProctoringScore((prevState) => ({
            ...prevState,
            mic: prevState.mic + 1,
          }));
        }
      }
    }
  };

  useEffect(() => {
    if (enablefullscreen && proctoringActive.mic && showalert) {
      handleAudioMonitoring();
    }
    return () => clearInterval(audioIntervalRef.current);
  }, [enablefullscreen, proctoringActive, showalert]);

  useEffect(() => {
    if (
      phoneDetected &&
      proctoringActive.PhoneinFrame &&
      showalert &&
      peoplewarning > 0
    ) {
      captureScreenshot();
      openModal("Phones are not allowed during test");

      setProctoringScore((prevState) => ({
        ...prevState,
        PhoneinFrame: prevState.PhoneinFrame + 1,
      }));
      setpeoplewarning((prev) => prev - 1);
    }
  }, [phoneDetected, enablefullscreen]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(data) {
    setIsOpen(true);
    setwarning(data);
    setshowalert(false);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    enterFullScreen();
    setshowalert(true);
  }
  useEffect(() => {
    const handleFullScreenChange = (e) => {
      if (!document.fullscreenElement && peoplewarning > 0) {
        enterFullScreen();
        setpeoplewarning((prev) => prev - 1);
        openModal("You cant't exist full screen");
        setProctoringScore((prevState) => ({
          ...prevState,
          TabSwitch: prevState.TabSwitch + 1,
        }));
        captureScreenshot();
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [enablefullscreen]);

  // Function to capture the screenshot and store it in the state
  const captureScreenshot = () => {
    const element = contentRef.current;

    html2canvas(element, {
      useCORS: true,
      scale: 1,
      height: window.innerHeight,
      width: window.innerWidth,
    }).then(async (canvas) => {
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // Convert Blob to base64
            const base64 = await blobToBase64(blob);
            const key = `screenshots${localStorage.getItem("assessmenttoken")}`;

            // Get the existing screenshots from localStorage
            const storedScreenshots =
              JSON.parse(localStorage.getItem(key)) || [];
            storedScreenshots.push(base64); // Add new base64 string

            // Update localStorage
            localStorage.setItem(key, JSON.stringify(storedScreenshots));

            // Update the state with the new Blob
            setScreenshots((prevScreenshots) => [...prevScreenshots, blob]);
          }
        },
        "image/jpeg",
        0.7
      );
    });
  };

  function handleReload() {
    // setenablefullscreen(true)
    enterFullScreen();
    Fetchdata();
  }

  const languageWiseApi = {
    javascript: "runBaseTestforJS",
    cpp: "runBaseTestforCpp",
    java: "runBaseTestforJava",
    python: "runBaseTestforPython",
  };
  const selectedlanguages = {
    javascript: "JavaScript",
    cpp: "C++",
    java: "Java",
    python: "Python",
  };
  const languageWisePayload = {
    javascript: "jsCode",
    cpp: "cppCode",
    java: "javaCode",
    python: "pythonCode",
  };
  let temp = true;

  async function Runsampletestcases() {
    try {
      console.log("during run", compiledcode);
      setshow(true);

      let token = localStorage.getItem("USER");

      const response = await fetch(BASE_URL + "/runProblemTestCases", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemId: allquestions[currentindex]?.problem?._id,
          submitted_solution:
            compiledcode ||
            allquestions[currentindex]?.problem?.initial_user_func[language]
              ?.initial_code,
          selected_language: selectedlanguages[language],
        }),
      });

      const result = await response.json();

      if (result?.success) {
        setshow(false);
        setoutput(result?.results);
      }
    } catch (error) {
      console.error("Error running test cases:", error);
    }
  }

  async function Submit() {
    try {
      // console.log("during run",compiledcode);
      setshow(true);
      let token = localStorage.getItem("USER");
      const tempdata = await fetch(BASE_URL + "/submitProblemSolution", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemId: allquestions[currentindex]?.problem?._id,
          submitted_solution:
            compiledcode ||
            allquestions[currentindex]?.problem?.initial_user_func[language]
              ?.initial_code,
          selected_language: selectedlanguages[language],
        }),
      });
      const response = await tempdata.json();
      // console.log(response);
      if (response?.success) {
        setshow(false);
        setoutput(response?.result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function Changequestion(ind) {
    // setcompiledcode()
    setallquestions((prevData) => {
      const updatedData = [...prevData];
      if (currentindex < updatedData.length) {
        const updatedProblem = { ...updatedData[currentindex].problem };
        const updatedUserFunc = { ...updatedProblem.initial_user_func };

        if (updatedUserFunc[language]) {
          updatedUserFunc[language] = {
            ...updatedUserFunc[language],
            initial_code: compiledcode,
          };
        }

        updatedProblem.initial_user_func = updatedUserFunc;
        updatedData[currentindex] = {
          ...updatedData[currentindex],
          problem: updatedProblem,
        };
      }

      return updatedData;
    });

    // setcompiledcode(allquestions[ind]?.problem?.initial_user_func[language]?.initial_code)
    setcurrentindex(ind);
    // console.log("change",allquestions[ind]?.problem?.initial_user_func[language]?.initial_code);
    setcompiledcode(
      allquestions[ind]?.problem?.initial_user_func[language]?.initial_code
    );
    setoutput([]);
  }

  return (
    <>
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-screen xsm:h-full mx-auto "
      >
        {enablefullscreen ? <Watermark /> : ""}
        <div
          ref={screenshotRef}
          className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white w-full overflow-hidden"
        >
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Warning"
            style={{
              content: {
                width: window?.innerWidth < 480 ? "300px" : "500px",
                margin: "auto",
                padding: "20px",
                height: "100px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <div className="flex justify-between">
              <div>{warning}</div>
              <button onClick={closeModal}>
                <ImCross />
              </button>
            </div>
          </Modal>
          <div>
            <Toaster />
            {camerablocked ? (
              <div className="flex justify-center w-full h-screen items-center font-semibold font-pop">
                If you want to continue the test then first turn on the camera.{" "}
              </div>
            ) : micblocked ? (
              <div className="flex justify-center w-full h-screen items-center font-semibold font-pop">
                If you want to continue the test then first turn on the
                microphone.{" "}
              </div>
            ) : (
              <div className="px-[1%] space-y-5 py-2 bg-white" ref={contentRef}>
                <div className="fixed bottom-0 left-0 font-pop xsm:top-10 xsm:left-0">
                  <div className="relative">
                    <video
                      playsInline
                      controls={false}
                      ref={videoRef}
                      width="200"
                      height="180"
                      className="rounded-xl xsm:w-24 xsm:h-20"
                      style={{ display: "block" }}
                    />
                    <canvas
                      ref={canvasRef}
                      width="200"
                      height="180"
                      className="absolute top-0 xsm:w-24 xsm:h-20"
                    />
                  </div>
                </div>

                {!enablefullscreen ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <button
                      className="bg-[#1DBF73] text-white rounded p-2"
                      onClick={enterFullScreen}
                    >
                      Enable full screen to continue test
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex w-full justify-between h-[92vh] overflow-y-auto xsm:overflow-y-auto xsm:flex-col xsm:gap-5 font-pop xsm:h-auto">
                      <>
                        <div className="w-full ">
                          {/* <h2 className="bg-[#0F2027] p-10 text-white taext mt-5 font-medium  rounded-2xl font-popping  sm:text-xl md:text-xl lg:text-xl xl:text-[23px]">
          Test Your Knowledge On Full Stack Development
        </h2> */}
                          <div className="grid sm:grid-cols-12 gap-4  bg-white w-full">
                            {/* Left Section: 3 Columns */}

                            <div className="col-span-12 lg:col-span-4 bg-white p-4 w-full ">
                              <div className="fixed top-0 flex items-center justify-center gap-5 cursor-pointer w-fit">
                                <div
                                  className="flex items-center"
                                  onClick={() => handleReload()}
                                >
                                  <SlRefresh />
                                  <p className="text-sm italic">
                                    Reload page if needed
                                  </p>
                                </div>
                                <p className="bg-white p-2 rounded-lg shadow-md font-bold">
                                  Time Remaining: {formatTime(timer)}
                                </p>
                              </div>
                              <h1 className="font-semibold  py-2  font-montserrat text-[18px]">
                                Problem Statement
                              </h1>

                              <div className="flex w-full">
                                <p className="text-md font-bold pr-2">
                                  {currentindex + 1}.
                                </p>
                                <div>
                                  <ol>
                                    <li>
                                      {
                                        allquestions[currentindex]?.problem
                                          ?.problem_detail
                                      }
                                    </li>
                                    {/* <li>Print the decimal value of each fraction.</li> */}
                                  </ol>
                                  {allquestions[
                                    currentindex
                                  ]?.problem?.sample_test_cases?.map(
                                    (item, index) => {
                                      return (
                                        <>
                                          <h2 className="font-semibold mt-3">
                                            Example: {index + 1}
                                          </h2>
                                          <ol>
                                            <li>Input: {item?.input}</li>
                                            <li>
                                              Output: {item?.expected_output}
                                            </li>
                                            {/* <li>
                    Explanation: The sum of elements from the 2nd position to
                    the 4th position is 12.
                  </li> */}
                                          </ol>
                                        </>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Section: 9 Columns */}
                            <div className="col-span-12 lg:col-span-8">
                              <div className="border border-black  rounded-xl">
                                <div className="flex flex-row basis-1/2grid  pb-0">
                                  <CodeEditor
                                    show={show}
                                    setshow={setshow}
                                    language={language}
                                    setlanguage={setlanguage}
                                    Runsampletestcases={Runsampletestcases}
                                    setcompiledcode={setcompiledcode}
                                    codesnippet={
                                      allquestions[currentindex]?.problem
                                        ?.initial_user_func[language]
                                        ?.initial_code
                                    }
                                    Submit={Submit}
                                  />
                                </div>
                              </div>

                              <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 my-6 bg-white">
                                <div className="border border-black pt-2 rounded-xl">
                                  <h3 className="text-md font-popping font-semibold p-2">
                                    Test Cases
                                  </h3>

                                  <div>
                                    <div className="  align-iteam pb-0 block w-full h-[150px] text-sm text-white bg-black  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 border-none outline-none  rounded-b-lg">
                                      {allquestions[
                                        currentindex
                                      ]?.problem?.sample_test_cases?.map(
                                        (item, index) => {
                                          return (
                                            <>
                                              <button
                                                onClick={() =>
                                                  settestcaseindex(index)
                                                }
                                                className={` ml-4 mt-2 hover:bg-sky-100 hover:text-black p-2 rounded ${
                                                  testcaseindex == index
                                                    ? "bg-green-500 text-white"
                                                    : ""
                                                }`}
                                              >
                                                Case {index + 1}
                                              </button>
                                            </>
                                          );
                                        }
                                      )}

                                      <p className="mt-3 ml-3">
                                        {" "}
                                        Input:{" "}
                                        {
                                          allquestions[currentindex]?.problem
                                            ?.sample_test_cases[testcaseindex]
                                            ?.input
                                        }
                                      </p>
                                      <p className=" mt-4 ml-3">
                                        Output:{" "}
                                        {
                                          allquestions[currentindex]?.problem
                                            ?.sample_test_cases[testcaseindex]
                                            ?.expected_output
                                        }
                                      </p>
                                    </div>
                                    {/* <textarea
                                    id="message"
                                    rows="4"
                                    class="block w-full h-[192px] text-sm text-white bg-black border-none outline-none resize-none rounded-b-lg"
                                    placeholder="Write your thoughts here..."
                                  ></textarea> */}
                                  </div>
                                </div>

                                <div className="border border-black pt-2 rounded-xl  ">
                                  <h3 className="text-md font-popping font-semibold p-2">
                                    Output
                                  </h3>
                                  {/* <textarea
                                    id="message"
                                    rows="4"
                                    className="block w-full h-[216px] text-sm text-white bg-black  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 border-none outline-none  rounded-b-lg"
                                    placeholder="Write your thoughts here..."
                                  ></textarea> */}
                                  <div className="block w-full h-[150px] text-sm text-white bg-black  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 border-none outline-none  rounded-b-lg overflow-y-auto p-3">
                                    {output?.map((item, index) => {
                                      return (
                                        <>
                                          <div className="mt-3 flex gap-2 items-center">
                                            <p>TestCase {index + 1}</p>
                                            {item?.success ? (
                                              <MdDone className="text-white text-lg  " />
                                            ) : (
                                              <ImCross className="text-white   " />
                                            )}
                                          </div>
                                          <div>
                                            Expected output :{" "}
                                            {item?.expectedOutput}
                                          </div>
                                          <div>
                                            Actual output : {item?.actualOutput}
                                          </div>
                                        </>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-end ">
                                <button
                                  onClick={() => handleClick(false, "")}
                                  className="bg-green-600 rounded p-2 text-white"
                                >
                                  Submit Assessment
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-1 text-xs font-medium mb-10">
                            {allquestions?.length > 0 ? (
                              <div className="flex justify-center gap-1 text-xs font-medium mb-10">
                                {allquestions?.map((item, index) => (
                                  <div key={index}>
                                    <p
                                      onClick={() => Changequestion(index)}
                                      className={`cursor-pointer block size-8 rounded border border-gray-100 text-center leading-8 text-gray-900 ${
                                        currentindex == index
                                          ? "bg-green-500 text-black"
                                          : ""
                                      }`}
                                    >
                                      {index + 1}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-red-500">
                                No questions available
                              </p>
                            )}

                            {/* {allquestions?.map((item, index) => {
                              return (
                                <>
                                  <div>
                                    <p
                                      onClick={() => Changequestion(index)}
                                      className={`cursor-pointer block size-8 rounded border border-gray-100  text-center leading-8 text-gray-900 ${
                                        currentindex == index
                                          ? "bg-green-500 text-black"
                                          : ""
                                      }`}
                                    >
                                      {index + 1}
                                    </p>
                                  </div>
                                </>
                              );
                            })} */}
                          </div>
                        </div>
                      </>
                    </div>
                  </>
                )}
                {show && (
                  <div className="w-full h-screen fixed top-0 left-0 bg-[#b4cca1] opacity-80">
                    <Spinner />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
