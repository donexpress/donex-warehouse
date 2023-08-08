import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifySession } from '../../../helpers/cookieUtils';

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const hasSession = verifySession();

  useEffect(() => {
    if (!hasSession) {
      router.push('/login');
    }
  }, [hasSession, router]);

  if (!hasSession) {
    return null;
  }

  return children;
};

export default ProtectedRoute;