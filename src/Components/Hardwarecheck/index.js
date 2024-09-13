import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function MediaCheck() {
    const [search,setsearch]=useSearchParams()
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [microphoneError, setMicrophoneError] = useState('');
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [micworking, setmicworking] = useState(false)
  const [cameraworking, setcameraworking] = useState(false)

  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      streamRef.current = cameraStream;
      setcameraworking(true)
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        alert("Camera access denied. Please allow camera access.");
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
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        alert("Microphone access denied. Please allow microphone access.");
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

function handleContinue(){
    // enterFullScreen()
    // setTimeout(() => {
        window.location.replace(`/questions?module_id=${search.get('module_id')}&index=1&t=${search.get('t')}`)

    // }, 1000);
}

  return (
    <div className='min-h-screen w-full'>
      <button onClick={startCamera}>Turn On Camera</button>
      <button className='ml-5' onClick={startMicrophone}>Turn On Microphone</button>
      {/* <button className='ml-5' onClick={enterFullScreen}>Enable Fullscreen</button> */}
      
      <div>
        {cameraError && <p style={{ color: 'red' }}>{cameraError}</p>}
        {microphoneError && <p style={{ color: 'red' }}>{microphoneError}</p>}
      </div>

      <div className='flex justify-between w-full'>
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }} />
        <canvas ref={canvasRef} width="800" height="100" style={{ marginTop: '20px', border: '1px solid black' }}></canvas>
      </div>
      <div className='flex justify-center mt-10'>     {(micworking  && cameraworking ) ? <button onClick={handleContinue} className='bg-[#1DBF73] text-white rounded p-2'>Continue test</button>:<button className='bg-[#1DBF73] cursor-not-allowed text-white rounded p-2 opacity-50'>Continue test</button>}
      </div>
      {/* <div className='flex justify-center mt-10'>      <button onClick={handleContinue} className='bg-[#1DBF73] text-white rounded p-2'>Continue test</button>
      </div> */}
      </div>
  );
}

export default MediaCheck;
