import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProctoredRoutes = ({ children, IsLogin, directTo = '/login' }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser) {
      navigate(directTo);
    }
  }, [authUser, navigate, directTo]);

  if (!authUser) return null;

  return children;
};

export default ProctoredRoutes;
