import { Link } from "react-router-dom";

export default function Enterance(){
    return (
        <div className="bg-[#F0F0F0] flex justify-center py-[5%] items-center font-pop">
            <div className="bg-white w-[70%] h-[70vh] px-[3%] py-[2%] flex flex-col gap-8 xsm:px-[1%] xsm:w-[90%] xsm:h-auto">
                <div className="flex justify-center">
                    <p className="font-pop font-semibold text-[26px] text-[#1DBF73]">Pay After Placement</p>
                </div>
                <div className="px-[5%]">Pay after Placement (PAP) is a way for dedicated students to join our industry oriented Full Stack courses without paying any fees upfront.</div>
                <div className="flex justify-around items-center xsm:flex-col xsm:px-4 xsm:gap-3">
                    <div className="min-h-[30vh] w-[25vw] border border-[#1DBF73] flex flex-col justify-center items-center p-5 gap-y-5 rounded-xl xsm:w-full xsm:p-2 xsm:min-h-[200px]">
                        <div className="text-xl font-semibold">Solve Assessments</div>
                        <div className="text-sm text-gray-500">You'll need to solve assesments & meet a certain score to be eligible for the coding test.</div>
                        <Link to='/instruction' className="p-2 rounded-md bg-[#1DBF73] text-white">Start Assessment</Link>
                    </div>
                <div className="min-h-[33vh] w-[25vw] border border-[#1DBF73] flex flex-col justify-center items-center p-5 gap-y-5 rounded-xl xsm:w-full xsm:p-2 xsm:min-h-[200px]">
                        <div className="text-xl font-semibold">Coding Test</div>
                        <div className="text-sm text-gray-500">Clear this coding test to become eligible for our Pay After Placement program.</div>
                        <div className="p-2 rounded-md bg-[#1DBF73] text-white cursor-not-allowed opacity-50">Coming soon</div>
                </div>
                </div>
                
            </div>
        </div>
    );
}