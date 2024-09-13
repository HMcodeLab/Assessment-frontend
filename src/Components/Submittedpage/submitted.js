import React from 'react'
import './submitted.css';
import { Link } from 'react-router-dom';

function SubmittedSuccess() {
    return (
        <div className='thankpage my-5 xsm:mx-2 md:flex md:justify-center md:items-center xsm:flex xsm:justify-center'>
            <div className="thank-you">
                <img width="188" height="188" src="/ok.gif" alt="ok" />
                <h1 className='text-[#1DBF73] font-semibold font-pop'>Assessment Completed Successfully</h1>
                <div className='text-center px-20'>Thank you for participating in PAP enrollment test. You will be receiving your test results via email in 24 Hrs.</div>
                <div className="button-container mt-5">
                    <a href={'/modules'}> <button className="view-order">Back to pap page</button></a>
                </div>
            </div>
        </div>
    );
}

export default SubmittedSuccess;