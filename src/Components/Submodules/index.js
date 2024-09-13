import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PiWarningOctagonBold } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import "../Modules/modules.css";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../Api";
import Spinner from "../../Spinner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function AllModules() {
  const modulesContainerRef = useRef(null);
  const [modulesdata, setmodulesdata] = useState([]);
  const [show, setshow] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [studentslist, setstudentslist] = useState([]);
  const [index, setindex] = useState(1);
  const [testreport, settestreport] = useState();
  const [time, settime] = useState()

  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [search,setsearch]=useSearchParams()
  const [title, settitle] = useState('')
  // const [recording, setRecording] = useState(false);
  // const mediaRecorderRef = useRef(null);

  const handleStartClick = (submodule_id) => {
    navigate("/devicecheckpage?moduleAssessmentid="+search.get('moduleAssessmentid')+"&module_id="+submodule_id+"&index=1&t="+time);
  };

  useEffect(() => {
    async function Fetchdata() {
      try {
        let token = localStorage.getItem("COURSES_USER_TOKEN");
        setshow(true);
        let url = BASE_URL + "/getusermoduleassessment/"+search.get('moduleAssessmentid');
        const data = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await data.json();
        // console.log(response);
        setCompleted(response?.isTestCompleted);
        settime(response?.data?.timelimit)
        // if (response.success) {
        //   setshow(false);
        // }
        // console.log(response);
        setmodulesdata(response?.data?.Assessmentmodules);
        settitle(response?.data?.assessmentName)
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
      <div className="w-full flex justify-between px-[5%] py-5 xsm:flex-col font-pop">
        <div className="w-full h-[85vh]  p-2 space-y-5 overflow-y-auto modules xsm:w-full xsm:h-fit">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700">
              {title}
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            {modulesdata?.map((item, ind) => {
              return (
                <>
                  {item?.isModuleCompleted || item?.Assessmentmodules?.progress > 0 ? (
                    <div className="w-full p-5 border  flex justify-between items-center rounded-xl">
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between w-full">
                          {/* <div className="font-[500]">PAP Assessment</div> */}
                          {(item?.isModuleCompleted && !item?.isSuspended) ||
                          item?.Assessmentmodules?.progress > 0 ? (
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="bg-[#1DBF73] rounded-full text-2xl text-white" />
                              <p>Completed</p>
                            </div>
                          ) : item?.isSuspended ? (
                            <div className="flex items-center space-x-2">
                              <PiWarningOctagonBold className="bg-red-500 rounded-full text-2xl text-white" />
                              <p>Suspended</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="font-semibold text-xl">
                          {item?.module?.moduleName}
                        </div>
                        <div className="flex  items-center  space-x-2">
                          <div style={{ width: "25px" }}>
                            <CircularProgressbar
                              value={item?.Assessmentmodules?.progress}
                              maxValue={100}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            Progress : {item?.Assessmentmodules?.progress?.toFixed(2)}%
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
                          {/* <div className="font-[500]">PAP Assessment</div> */}
                          {item?.isModuleCompleted || item?.Assessmentmodules?.progress > 0 ? (
                            <div className="flex items-center gap-2">
                              <FaCheckCircle className="bg-[#1DBF73] rounded-full text-2xl text-white" />
                              <p>Completed</p>
                            </div>
                          ) : item?.isSuspended ? (
                            <div className="flex items-center space-x-2">
                              <PiWarningOctagonBold className="bg-red-500 rounded-full text-2xl text-white" />
                              <p>Suspended</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="font-semibold text-xl">
                          {item?.module?.moduleName}
                        </div>
                        <div className="flex  items-center  gap-1">
                          <div style={{ width: "25px" }}>
                            <CircularProgressbar
                              value={item?.Assessmentmodules?.progress}
                              maxValue={100}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            Progress : {item?.Assessmentmodules?.progress?.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {item.module_description}
                        </div>
                      </div>

                      {/* <FaGreaterThan className="text-3xl text-gray-500 font-extralight" /> */}
                      {/* <Link  to={`/hardwarecheck?module_id=${item._id}&index=1&t=${item?.timelimit}`} className="bg-[#1DBF73] h-fit text-white px-4 py-1 rounded absolute bottom-5 right-5">Start</Link> */}

                      <button
                        onClick={()=>handleStartClick(item?.module?._id)}
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
