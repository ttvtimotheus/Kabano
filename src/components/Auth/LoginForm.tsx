import React, { useState } from 'react';
import { IconEyeOff, IconEye, IconLogin } from '@tabler/icons-react';
import { useAuthStore } from '../../store/authStore';
import './Auth.scss';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="auth-form">
      <h2>Welcome back!</h2>
      <p className="subtitle">Log in to continue to Kabano</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            'Logging in...'
          ) : (
            <>
              <IconLogin size={20} />
              Log In
            </>
          )}
        </button>
      </form>

      <div className="auth-links">
        <a href="#forgot-password">Forgot password?</a>
        <span className="separator">•</span>
        <a href="#register">Create account</a>
      </div>
    </div>
  );
};
