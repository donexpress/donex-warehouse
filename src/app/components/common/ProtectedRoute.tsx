import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifySessionOMS, verifySessionWMS } from '../../../helpers/cookieUtils';
import { isOMS, isWMS} from '../../../helpers';

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const hasSessionOMS = verifySessionOMS();
  const hasSessionWMS = verifySessionWMS();

  useEffect(() => {
    const { locale } = router.query;
    if (isWMS() && !hasSessionWMS) {
      router.push(`/${locale}/wms/login`);
    }
    if (isOMS() && !hasSessionOMS) {
      router.push(`/${locale}/oms/login`);
    }
  }, [hasSessionWMS, hasSessionOMS, router]);

  return children;
};

export default ProtectedRoute;