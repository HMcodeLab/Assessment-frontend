import React, { useState } from 'react';
import { BASE_URL } from '../Api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailVerificationForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [query,setquery]=useSearchParams()
  let assessmentToken= query.get('assessmenttoken')||'d04244caa91168538b9d2c21eb8c08a50cb4d3d4193bba56eef02624d7780f31'
  localStorage.setItem('assesmenttoken',assessmentToken)
let navigate=useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (email) {
      const data=await fetch(BASE_URL+'/verifyUserAccessForAssessment?assessmentToken='+assessmentToken+'&email='+email)
      const response=await data.json()
      // console.log(response);
      if(response?.success){
        toast.success(response?.msg)
        localStorage.setItem('USER',response.token)
        navigate('/hardwarechecking')
      }
      else{
        toast.error(response?.message)
      }
    } else {
      // alert('Please enter a valid email.');
      toast.error('Please enter a valid email.')
    }
  };

  return (<>
  <Toaster/>
  
    <div className="min-h-screen flex justify-center items-center ">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Email
        </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-transparent transition duration-200"
                placeholder="Enter your registered email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 bg-white px-1 text-gray-500 text-sm"
              >
                Email Address
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-300"
            >
              Verify Email
            </button>
          </form>
      </div>
    </div>
    </>  );
};

export default EmailVerificationForm;
