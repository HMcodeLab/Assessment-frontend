import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Api";

const StartTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartTest = async () => {
    const token = localStorage.getItem("USER");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/StartCodingAssessment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to start the test");
      }

      const data = await response.json();
      console.log("Test Started:", data);
      setTimeout(() => navigate("/coding-assessment"), 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Error starting the test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      ) : (
        <button
          onClick={handleStartTest}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600 transition"
        >
          Start Your Coding Test
        </button>
      )}
    </div>
  );
};

export default StartTest;
