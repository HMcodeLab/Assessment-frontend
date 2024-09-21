import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="h-screen bg-gray-50 py-10 px-4 w-full" >
      {/* Left: Image and Text, Right: Feedback Form */}
      <div className="flex  items-center justify-center gap-5 mx-auto">
        {/* Left: Image and Text */}
        <div className='md:w-1/2 flex justify-center items-center flex-col '>
          <img width="188" height="188" src="/suspended.png" alt="suspended" />
          <h1 className='text-red-600 font-semibold text-2xl mt-4'>Assessment Suspended</h1>
          <div className="mt-12  rounded-lg  p-8 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Contact Us</h3>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-start">
            <FaPhoneAlt className="text-[#1DBF73] text-lg mr-3" />
            <span className="text-gray-700 text-lg">+123 456 7890</span>
          </div>
          <div className="flex items-center justify-start">
            <FaEnvelope className="text-[#1DBF73] text-lg mr-3" />
            <span className="text-gray-700 text-lg">contact@company.com</span>
          </div>
          <div className="flex items-center justify-start">
            <FaMapMarkerAlt className="text-[#1DBF73] text-lg mr-3" />
            <span className="text-gray-700 text-lg">123 Feedback Lane, Your City</span>
          </div>
        </div>
      </div>
        </div>

        {/* Right: Feedback Form */}
        <div className="bg-white rounded-lg shadow-xl p-8  w-[40%] mt-8 md:mt-0">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            We'd Love Your Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1DBF73] focus:border-[#1DBF73]"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1DBF73] focus:border-[#1DBF73]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1DBF73] focus:border-[#1DBF73]"
                placeholder="Write your feedback here"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#1DBF73] text-white font-semibold rounded-md shadow-lg hover:bg-green-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-200"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>

     
    </div>
  );
};

export default FeedbackPage;
