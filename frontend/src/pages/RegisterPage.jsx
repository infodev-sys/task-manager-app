import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';
import { useAuth } from '../../src/context/AuthContext';
import useForm from '../../src/hooks/useForm';
import { validateRegister } from '../../src/utils/validation';
import './Auth.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', email: '', password: '' },
    validateRegister
  );

  const onSubmit = handleSubmit(async (data) => {
    setServerError('');
    try {
      await register(data);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2>Your tasks,<br />beautifully managed.</h2>
          <p>Join thousands of productive people using TaskFlow.</p>
        </div>
        <div className="auth-dots">
          {[...Array(12)].map((_, i) => <div key={i} className="dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card animate-fadeIn">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Start organizing your work today</p>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                type="text" name="name" value={values.name}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Jane Doe" autoComplete="name"
              />
              {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
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
                placeholder="Min. 6 characters" autoComplete="new-password"
              />
              {touched.password && errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 24 }}>
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
