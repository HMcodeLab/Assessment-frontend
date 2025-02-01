import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmailVerificationForm from './Components/Emailverify';
// import Instruction from './Components/Instruction/Instruction';
import DeviceCheckPage from './Components/Modules/DeviceCheckModal/DeviceCheckModal';
import NewQuestion from './Components/newpatternquestion';
import Submittedassessment from './Components/Submittedpage/submitassessment';
import Suspended from './Components/Submittedpage/suspended';
import Normalassessment from './Components/normalassessment';
import TestTimer from './Components/temp';
import Watermark from './Components/temp';
import First from './Components/Enterancepage/First';
import TestApp from './Components/Enterancepage/AssessmentPage';
import ScreenshotTest from './Components/screenshot';
import FeedbackForm from './Components/Contactus';
import CodingAssessment from './coding/codingAssessment';
import StartTest from './coding/StartTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestApp />} />
        <Route path="/hardwarechecking" element={<DeviceCheckPage />} />
        <Route path="/question" element={<NewQuestion />} />
        <Route path="/submitted" element={<Submittedassessment />} />
        <Route path="/suspended" element={<Suspended />} />
        <Route path="/nmquestion" element={<Normalassessment />} />
        <Route path="/start-coding" element={<StartTest />} />
        <Route path="/coding-assessment" element={<CodingAssessment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
