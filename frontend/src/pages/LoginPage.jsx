import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import useForm from '../../src/hooks/useForm';
import { validateLogin } from '../../src/utils/validation';
import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin
  );

  const onSubmit = handleSubmit(async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">✦</div>
          <h1 className="auth-app-name">TaskFlow</h1>
        </div>
        <div className="auth-tagline">
          <h2>Organize your work,<br />amplify your impact.</h2>
          <p>A focused task manager for people who get things done.</p>
        </div>
        <div className="auth-dots">
          {[...Array(12)].map((_, i) => <div key={i} className="dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card animate-fadeIn">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                type="email" name="email" value={values.email}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="you@example.com" autoComplete="email"
              />
              {touched.email && errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Password</label>
              <input
                className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                type="password" name="password" value={values.password}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="••••••••" autoComplete="current-password"
              />
              {touched.password && errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 24 }}>
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
