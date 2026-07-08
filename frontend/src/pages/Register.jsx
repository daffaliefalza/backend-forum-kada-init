import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../api/auth";

function Register({ onRegister }) {
  // Declare state variables
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to handle when its submitted
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await registerUser({ name, email, password });
      await onRegister();
      navigate("/posts");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your Name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your Password"
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
export default Register;
