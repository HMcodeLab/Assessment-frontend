import React from 'react'
import './submitted.css';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
function Submittedassessment() {
    return (
        <div className='thankpage my-5 xsm:mx-2 md:flex md:justify-center md:items-center xsm:flex xsm:justify-center'>
            <div className="thank-you">
                <img width="188" height="188" src="/ok.gif" alt="ok" />
                <h1 className='text-[#1DBF73] font-semibold font-pop'>Assessment Completed Successfully</h1>
                <div className="text-center  flex flex-col justify-center items-center">
            <p className=" text-[#3C3C3C] font-Poppinspins  text-[40px] font-semibold ">
              Contact Us For Support
            </p>
            <div className="flex items-center space-x-4 text-[18px] ">
              {/* <CgMail className="text-[#3C3C3C] font-semibold font-Poppins h-8 w-14" /> */}
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins">
              Email : support@hopingminds.com
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[18px] ">
              {/* <FaPhoneAlt className="text-[#3C3C3C] font-semibold font-Poppins h-7 w-5" /> */}
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins">
                Phone : +91 7447732467, 356263553
              </p>
            </div>
          </div>
            </div>
        </div>
    );
}

export default Submittedassessment;