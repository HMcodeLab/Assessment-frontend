import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PiWarningOctagonBold } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import "./modules.css";
import { useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../../Api";

export default function Modules() {
  const modulesContainerRef = useRef(null);
  const [modulesdata, setmodulesdata] = useState([]);
  const [show, setshow] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [studentslist, setstudentslist] = useState([]);
  const [index, setindex] = useState(1);
  const [testreport, settestreport] = useState();

  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [time,settime]=useState()
  // const [recording, setRecording] = useState(false);
  // const mediaRecorderRef = useRef(null);
  async function handleContinue(moduleAssessmentid,time){
    let token=localStorage.getItem('COURSES_USER_TOKEN')
    try {
      const data=await fetch(BASE_URL+'/startmoduleassessment',{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-type':'application/json',

        },
        body:JSON.stringify({
          moduleAssessmentid:moduleAssessmentid
        })
      })
      const response=await data.json()
      if(response.success){
        window.location.replace("/nmquestion?moduleAssessmentid="+moduleAssessmentid+"&t="+time+"&index=1");
      }
      else{
        toast.error(response.message)
      }
    } catch (error) {
      
    }
  }
  const handleStartClick = (id,time,type) => {
    if(type){
      navigate("/devicecheckpage?moduleAssessmentid="+id+"&t="+time);
    }
    else{
      handleContinue(id,time)
    }

  };

  useEffect(() => {
    async function Fetchdata() {
      try {
        let token = localStorage.getItem("COURSES_USER_TOKEN");
        setshow(true);
        let url = BASE_URL + "/getallusermoduleassessment";
        const data = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await data.json();
        settime(response?.timelimit)
        // console.log(response);
        setCompleted(response?.isTestCompleted);
        // if (response.success) {
        //   setshow(false);
        // }
        // console.log(response);
        setmodulesdata(response?.data);
        setshow(false)
        // setshow(false)
      } catch (error) {
        console.log(error);
      }
    }
    Fetchdata();
  }, []);


  return (
    <>
    <Toaster/>
      <div className="w-full flex justify-between px-[5%] py-5 xsm:flex-col font-pop">
        {/* <div className="w-[35%] h-[85vh] bg-[#d8f7e8] p-[2%] space-y-2 rounded-xl xsm:w-full xsm:h-fit xsm:px-[3%] xsm:py-[5%]">
          <div className="text-3xl font-bold text-center">
            Pay After Placement
          </div>
          <div className="mt-2">
            Enroll in our courses without paying any upfront fees
          </div>

          <div className="flex flex-col gap-y-10 py-2">
            <div className="flex justify-between py-5">
              <div className="h-9 w-9 bg-black text-white flex justify-center items-center rounded-full">
                1
              </div>
              <div className="w-[85%] space-y-1 ">
                <div className="font-semibold text-lg">Solve Assessments</div>
                <div className="text-sm">
                  You should complete assignments & score 550 to be eligible for
                  the Coding Test
                </div>
                <button
                  className="w-[50%] p-2 bg-[#1DBF73] text-white rounded-lg"
                  onClick={handleStartButtonClick}
                >
                  Start
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="h-9 w-9 bg-black text-white flex justify-center items-center rounded-full">
                2
              </div>
              <div className="w-[85%]">
                <div className="font-semibold text-lg">Coding Test</div>
                <div className="text-sm">DEADLINE: 16TH APR, 11:59 PM</div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="w-full h-[85vh]  p-2 space-y-5 overflow-y-auto modules xsm:w-full xsm:h-fit">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700">
              PAY AFTER PLACEMENT
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            {/* <div className="w-full border bg-gray-200 p-5  rounded-xl space-y-3">
              <div className="font-semibold">
                Tracker Your Assignments Score
              </div>
              <div className="h-8 bg-white text-[#1DBF73] flex pl-5 items-center rounded-lg">
                Your current score is {testreport?.obtainedMarks}
              </div>
              <div className="flex justify-between text-sm xsm:flex-col xsm:gap-2">
                <div>
                  You need to solve all assignments to be eligible for the
                  coding test.
                </div>
                <div className="font-semibold">Max Score : {testreport?.totalMarks}</div>
              </div>
            </div> */}
            {modulesdata?.map((item, ind) => {
              return (
                <>
                  {item?.isAssessmentCompleted || item?.totalProgress>0 ? (
                    <div className="w-full p-5 border  flex justify-between items-center rounded-xl">
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between w-full">
                          <div className="font-[500]">PAP Assessment</div>
                          {(item?.isAssessmentCompleted && !item?.isSuspended)  ? (
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="bg-[#1DBF73] rounded-full text-2xl text-white" />
                              <p>Completed</p>
                            </div>
                          ) : item?.isSuspended || item?.totalProgress>0 ? (
                            <div className="flex items-center space-x-2">
                              <PiWarningOctagonBold className="bg-red-500 rounded-full text-2xl text-white" />
                              <p>Suspended</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="font-semibold text-xl">
                          {item?.assessmentName}
                        </div>
                        <div className="flex  items-center  space-x-2">
                          <div style={{ width: "25px" }}>
                            <CircularProgressbar
                              value={item?.totalProgress}
                              maxValue={100}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            Progress : {item?.totalProgress?.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {item?.module_description}
                        </div>
                      </div>

                      {/* <FaGreaterThan className="text-3xl text-gray-500 font-extralight" /> */}
                    </div>
                  ) : (
                    // <div onClick={handleCamera}>
                    <div className="w-full p-5 border  flex justify-between items-center rounded-xl relative ">
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between w-full ">
                          <div className="font-[500]">PAP Assessment</div>
                          {item?.isAssessmentCompleted  ? (
                            <div className="flex items-center gap-2">
                              <FaCheckCircle className="bg-[#1DBF73] rounded-full text-2xl text-white" />
                              <p>Completed</p>
                            </div>
                          ) : item?.isSuspended || item?.totalProgress>0 ? (
                            <div className="flex items-center space-x-2">
                              <PiWarningOctagonBold className="bg-red-500 rounded-full text-2xl text-white" />
                              <p>Suspended</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="font-semibold text-xl">
                        {item?.assessmentName}
                        </div>
                        <div className="flex  items-center  gap-1">
                          <div style={{ width: "25px" }}>
                            <CircularProgressbar
                              value={item?.totalProgress}
                              maxValue={100}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            Progress : {item?.totalProgress?.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {item?.module_description}
                        </div>
                      </div>

                      {/* <FaGreaterThan className="text-3xl text-gray-500 font-extralight" /> */}
                      {/* <Link  to={`/hardwarecheck?module_id=${item._id}&index=1&t=${item?.timelimit}`} className="bg-[#1DBF73] h-fit text-white px-4 py-1 rounded absolute bottom-5 right-5">Start</Link> */}

                      <button
                        onClick={()=>handleStartClick(item._id,item?.timelimit,item?.isProtected)}
                        className="bg-[#1DBF73] h-fit text-white px-4 py-1 rounded absolute bottom-5 right-5"
                      >
                        Start
                      </button>
                      {/* <div>
                        <div
                          onClick={handleOpenModal}
                          className="bg-[#1DBF73] h-fit text-white px-4 py-1 rounded absolute bottom-5 right-5 cursor-pointer"
                        >
                          Start
                        </div>

                        {isModalOpen && (
                          <DeviceCheckModal onClose={handleCloseModal} />
                        )}
                      </div> */}
                    </div>
                    // </div>
                  )}
                </>
              );
            })}
          </div>

          {/* <div className="w-full border rounded-t-xl">
            <div className="p-5 bg-[#1DBF73] text-white rounded-t-xl">
              <div className="text-xs">PAY AFTER PLACEMENT</div>
              <div className="text-lg">Selection list : April Batch</div>
              <div className="text-sm">
                Check out the list of Top performers
              </div>
            </div>

            <div className="w-[60%]  flex flex-col justify-between p-5">
              <div className="flex flex-row gap-16">
                <div>#</div>
                <div>Students</div>
              </div>

              {studentslist?.map((item, ind) => {
                return (
                  <>
                    <div className="flex flex-row gap-16 my-2">
                      <div>{ind + 1}</div>
                      <div>
                        {item.name}({item.phone})
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div> */}
        </div>
        {show ? (
          <div className="w-full h-screen fixed top-0 left-0 bg-[#b4cca1] opacity-80">
            <Spinner className="" />
          </div>
        ) : (
          ""
        )}
      </div>

      {/* {showWebcam && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <button
            className=" top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-full"
            onClick={handleCamera}
          >
            Close
          </button>
          <button
            className=" top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-full"
            onClick={handleCapture}
          >
            Capture
          </button>
          {showMessage && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 p-4 rounded-md shadow-lg z-50">
              <p className="text-center text-lg text-gray-800">
                Picture captured successfully!
              </p>
            </div>
          )}
        </div>
      )} */}
    </>
  );
}
