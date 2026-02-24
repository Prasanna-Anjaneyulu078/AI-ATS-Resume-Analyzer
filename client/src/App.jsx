import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import YourResumes from "./components/YourResumes"; // Adjust path if needed
import Contact from "./components/Contact"; // Import Contacts component
import ProtectedRoute from "./components/ProtectedRoute"; // Ensure this is correctly implemented
import Navbar from "./components/Navbar"; // Import Navbar
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar /> {/* Include Navbar in the layout */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/your-resumes"
          element={
            <ProtectedRoute>
              <YourResumes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;