import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";

export default function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/verify-email" element={<VerifyEmail />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/update-password/:id" element={<UpdatePassword />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </div>
  );
}
