import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Home  from "./components/Home";
import LoginForm from "./components/Login";
import SignupForm from "./components/Signup";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;
