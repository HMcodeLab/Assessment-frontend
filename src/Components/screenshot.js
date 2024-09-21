import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const ScreenshotTest = () => {
  const screenshotRef = useRef();
  const [screenshots, setScreenshots] = useState([]);

  // Function to capture the screenshot and store it in the state
  const captureScreenshot = () => {
    const element = screenshotRef.current;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Add the captured screenshot to the state
      setScreenshots((prevScreenshots) => [...prevScreenshots, imgData]);
    });
  };

  // Function to send all screenshots to the server when the test is finished
  const submitTest = async () => {
    console.log(screenshots);
    
  };

  return (
    <div>
      <div ref={screenshotRef} className="p-5 border">
        <h1>Test Page</h1>
        <p>This part of the DOM will be captured as an image during the test.</p>
      </div>

      <button onClick={captureScreenshot} className="mt-5 p-2 bg-blue-500 text-white">
        Capture Screenshot
      </button>

      {/* Submit test and send all screenshots to server */}
      <button onClick={submitTest} className="mt-5 p-2 bg-green-500 text-white">
        Submit Test
      </button>
    </div>
  );
};

export default ScreenshotTest;
