import React from 'react';
import LoginForm from '../../features/auth/components/LoginForm.jsx';

export const LoginPage = () => {
  return (
    <div className="login-page py-6">
      <div className="container">
        <div className="login-layout">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
