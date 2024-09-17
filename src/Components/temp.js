import React, { useState, useEffect } from "react";

const TestTimer = () => {
  // Initialize the timer state (duration in seconds)
  const [timeLeft, setTimeLeft] = useState(20);

  // Format the time in HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // useEffect to handle the countdown logic
  useEffect(() => {
    // Check if time is up
    if (timeLeft === 0) return;

    // Update the time every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <div>
      <h1>Test Timer</h1>
      <div id="timer" style={{ fontSize: "24px", fontWeight: "bold" }}>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

// Example usage: 1 hour (3600 seconds) timer


export default TestTimer;
