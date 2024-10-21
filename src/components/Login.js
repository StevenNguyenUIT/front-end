import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate hook for redirection
import { API_BASE_URL } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // const response = await fetch('https://hmeeszhorb.execute-api.us-east-1.amazonaws.com/login', {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to detail page
        console.log("Login successful", data);

        // Save the email in localStorage or pass it as state
      localStorage.setItem('email', email); // Optionally store email in localStorage
        // Navigate to detail page
        navigate('/detail', { state: { userDetails: data.user } });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <a className='center' onClick={() => navigate('/signup')}><u>Sign Up</u></a>
      {/* <div className='center'>
            <a href="/signup">Sign Up</a>
        </div> */}
    </div>
  );
};

export default Login;
