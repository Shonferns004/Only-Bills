import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { setLocalStorage } from '../services/Storage';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast.error('Authentication failed');
        navigate('/login');
        return;
      }

      const { email, user_metadata } = session.user;
      try {
        const res = await axios.post(`${API_URL}/api/auth/google`, {
          email,
          displayName: user_metadata?.full_name || user_metadata?.name || email?.split('@')[0],
          googleId: session.user.id,
        });
        setLocalStorage('userDetail', res.data.user);
        toast.success('Logged in with Google');
        navigate('/home');
      } catch {
        toast.error('Google login failed');
        navigate('/login');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-32" />
      </div>
    </div>
  );
}

export default AuthCallback;
