import './App.css';
import Login from './components/login/Login';
import { Routes, Route } from 'react-router-dom'
import Signup from './components/signup/Signup';
import EmpDashboard from './components/employeeDashboard/EmpDashboard';
import Admin from './components/adminDashoard/Admin';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/empDashboard" element={<EmpDashboard />} />
        <Route path="/admin" element={< Admin/>} />
    </Routes>


    </>
  );
}

export default App;
