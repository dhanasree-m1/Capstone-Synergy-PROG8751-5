import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleChange = (e, formType) => {
    if (formType === 'login') {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    } else {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    const formData = formType === 'login' ? loginData : registerData;
    const endpoint = formType === 'login' ? 'login' : 'register';

    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (formType === 'login') {
          localStorage.setItem('token', data.token);
          navigate('/Home');
        } else {
          setMessage(data.message || 'User registered successfully');
        }
      } else {
        setMessage(data.message || `Error in ${formType}`);
      }
    } catch (error) {
      setMessage(`Error in ${formType}`);
    }
  };

  return (
    <div className="login-container"> 
      <div className="login-box">
        <h2 className="form-title">{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={(e) => handleSubmit(e, isLogin ? 'login' : 'register')}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="input-field"
              value={isLogin ? loginData.username : registerData.username}
              onChange={(e) => handleChange(e, isLogin ? 'login' : 'register')}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              value={isLogin ? loginData.password : registerData.password}
              onChange={(e) => handleChange(e, isLogin ? 'login' : 'register')}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleForm} className="toggle-btn">
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
