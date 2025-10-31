import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Register.css';

function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://taskapp-backend-1-ryqr.onrender.com";

    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName, 
            username,
            email,
            password
          })
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Registration successful!");
          navigate('/login');
        } else {
          toast.error(data.message || "Registration failed.");
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
