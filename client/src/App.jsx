import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import YourResumes from "./components/YourResumes";
import AnalysisHistory from "./components/AnalysisHistory";
import Contact from "./components/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/analyzer"
          element={
            <ProtectedRoute>
              <YourResumes key="analyzer" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/your-resumes"
          element={
            <ProtectedRoute>
              <YourResumes key="your-resumes" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis-history"
          element={
            <ProtectedRoute>
              <AnalysisHistory />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;