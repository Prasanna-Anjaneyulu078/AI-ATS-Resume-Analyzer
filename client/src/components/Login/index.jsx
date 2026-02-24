import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = "http://localhost:5000/auth/login";
    const userDetails = {
      email,
      password
    }
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userDetails)
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleEmail}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePassword}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;