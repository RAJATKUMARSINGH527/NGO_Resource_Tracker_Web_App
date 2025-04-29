import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from "./components/Home";
import LoginForm from "./components/Login";
import SignupForm from "./components/Signup";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import InventoryManagement from "./components/Inventory";
import Settings from "./components/Setting";
import LogisticsManagement from "./components/Logistics";
import Dashboard from "./components/Dashboard";
import DonorManagement from "./components/Donors";



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/logistics" element={<LogisticsManagement />} />
          <Route path="/donors" element={<DonorManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/header" element={<Header />} />
          {/* Add more routes as needed */}
          </Routes>
      </Router>
    </>
  );
}

export default App;
