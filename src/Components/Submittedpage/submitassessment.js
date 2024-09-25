import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { BASE_URL } from '../../Api';
import toast, { Toaster } from 'react-hot-toast';

const Submittedassessment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    feedback: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone number validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number is invalid';
    }

    // Feedback validation
    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      const data=await fetch(BASE_URL+'/submitUserFeedback',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
        },
body:JSON.stringify(formData)
      })
      const response=await data.json();
      if(response.success){
          toast.success(response.message)
          setFormData({name:'',phone_number:'',feedback:'',email:''})
      }
      else{
        toast.error(response.message)
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 py-10 px-4 w-full">
      <Toaster/>
      {/* Left: Image and Text, Right: Feedback Form */}
      <div className="flex items-center justify-center gap-5 mx-auto xsm:flex-col">
        {/* Left: Image and Text */}
        <div className='md:w-1/2 flex justify-center items-center flex-col '>
          <img width="188" height="188" src="/ok.gif" alt="submitted" />
          <h1 className='text-[#1DBF73] font-semibold text-2xl mt-4'>Assessment Submitted</h1>
          <div className="mt-12 rounded-lg p-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Contact Us</h3>
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-start">
                <FaPhoneAlt className="text-[#1DBF73] text-lg mr-3" />
                <span className="text-gray-700 text-lg">90560-22600, 9139100050</span>
              </div>
              <div className="flex items-center justify-start">
                <FaEnvelope className="text-[#1DBF73] text-lg mr-3" />
                <span className="text-gray-700 text-lg">support@hopingminds.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feedback Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 w-[40%] mt-5 md:mt-0 xsm:w-full max-h-[90vh] overflow-y-auto scrollbarnumber2">
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
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700">
                Your Phone Number
              </label>
              <input
                type="number"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1DBF73] focus:border-[#1DBF73]"
                placeholder="Enter your phone number"
                required
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
            </div>
            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700">
                Your Feedback
              </label>
              <textarea
                name="feedback"
                id="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1DBF73] focus:border-[#1DBF73]"
                placeholder="Write your feedback here"
                required
              />
              {errors.feedback && <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>}
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

export default Submittedassessment;
