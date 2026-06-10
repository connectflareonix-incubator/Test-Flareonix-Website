import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { API } from '@/config/constants';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            code: code,
            redirect_uri: window.location.origin + '/auth/callback'
          })
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          window.history.replaceState(null, '', '/dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white text-lg">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
