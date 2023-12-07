import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifySessionOMS, verifySessionWMS, sessionWMSIsExpires, sessionOMSIsExpires, removeAllCookies, removeCookie } from '../../../helpers/cookieUtils';
import { isOMS, isWMS} from '../../../helpers';
import { Loading } from './Loading';

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const hasSessionOMS = verifySessionOMS();
  const hasSessionWMS = verifySessionWMS();
  const isExpireWMS = sessionWMSIsExpires();
  const isExpireOMS = sessionOMSIsExpires();

  useEffect(() => {
    const { locale } = router.query;
    if (isWMS() && (!hasSessionWMS || isExpireWMS)) {
      //removeAllCookies();
      removeCookie("tokenWMS");
      removeCookie("profileWMS");
      removeCookie("expireWMS");
      router.push(`/${locale}/wms/login`);
    } else if (isOMS() && (!hasSessionOMS || isExpireOMS)) {
      //removeAllCookies();
      removeCookie("tokenOMS");
      removeCookie("profileOMS");
      removeCookie("expireOMS");
      router.push(`/${locale}/oms/login`);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSessionWMS, hasSessionOMS, router]);

  return (
    <>
      <Loading loading={loading} isFromProtectedRoute={true}>
        {children}
      </Loading>
    </>
  );
};

export default ProtectedRoute;