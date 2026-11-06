import React from 'react';
import { SignInCard } from '@/components/ui/sign-in-card-2';
import { useAuthStore } from '../../store/useAuthStore';

export const Login = ({ onNavigate }) => {
  const login = useAuthStore((state) => state.login);

  const handleLogin = async ({ email, password }) => {
    const success = await login(email, password);
    if (success) {
      localStorage.setItem('SkillSync_has_account', 'true');
      onNavigate('home');
    }
  };

  return (
    <SignInCard
      onNavigate={onNavigate}
      onLogin={handleLogin}
      defaultEmail=""
      defaultPassword=""
      appName="SkillSync"
    />
  );
};

export default Login;
