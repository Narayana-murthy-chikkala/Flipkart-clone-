import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../redux/authSlice';
import './Login.css'; // Reusing the same structure as Login

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setSignupSuccess(true);
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ name, email, password }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1>Looks like you're new here!</h1>
          <p>Sign up with your email to get started</p>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Signup Illustration" />
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Enter Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Enter Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Enter Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <p className="terms-text">
              By continuing, you agree to our <span>Terms of Use</span> and <span>Privacy Policy</span>.
            </p>
            {signupSuccess && (
              <div className="success-message" style={{ color: '#28a745', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                Account created successfully! Redirecting...
              </div>
            )}
            <button type="submit" className="login-btn" disabled={loading || signupSuccess}>
              {loading ? 'Creating Account...' : signupSuccess ? 'Redirecting...' : 'Continue'}
            </button>
          </form>
          <div className="signup-link">
            <Link to="/login">Existing User? Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
