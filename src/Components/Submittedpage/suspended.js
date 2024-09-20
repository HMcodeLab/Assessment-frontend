import React from 'react'
import './submitted.css';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
function Suspended() {
    return (
        <div className='thankpage my-5 xsm:mx-2 md:flex md:justify-center md:items-center xsm:flex xsm:justify-center'>
            <div className="thank-you">
                <img width="188" height="188" src="/suspended.png" alt="suspended" />
                <h1 className='text-red-600 font-semibold font-pop'>Assessment Suspended</h1>
                <div className="text-center  flex flex-col justify-center items-center w-full">
            <p className=" text-[#3C3C3C] font-Poppinspins  text-[40px] font-semibold ">
              Contact Us For Support
            </p>
            <div className="flex items-center space-x-4 text-[18px] ">
              {/* <CgMail className="text-[#3C3C3C] font-semibold font-Poppins h-8 w-14" /> */}
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins xsm:ml-0">
              Email : support@hopingminds.com
              </p>
            </div>
            <div className="flex items-center space-x-4 text-[18px] ">
              {/* <FaPhoneAlt className="text-[#3C3C3C] font-semibold font-Poppins h-7 w-5" /> */}
              <p className="ml-24 text-[#3C3C3C] font-semibold font-Poppins xsm:ml-0">
                Phone : +91 7447732467, 356263553
              </p>
            </div>
                </div>
                {/* <div className='text-center px-20'>Thank you for participating in PAP enrollment test. You will be receiving your test results via email in 24 Hrs.</div> */}
                {/* <div className="button-container mt-5">
                    <a href={'/'}> <button className="view-order">Back to home</button></a>
                </div> */}
            </div>
        </div>
    );
}

export default Suspended;