import Head from 'next/head';
import '../../../styles/globals.scss';
import LoginBody from '../../../src/app/components/common/LoginBody';
import { GetServerSidePropsContext } from 'next';
import { isWMS, isOMS } from '../../../src/helpers';
import { AppProps } from '../../../src/types';

const Login = ({ inWMS, inOMS}: AppProps) => {
  
  return <div className='custom-background scrollable-hidden'>
        <Head>
          <title>Don Express Warehouse</title>
          <link rel="icon" href="/logo_a2a56_favicon.png" />
        </Head>
        <LoginBody inWMS={inWMS} inOMS={inOMS}/>
    </div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const inWMS = isWMS(context);
  const inOMS = isOMS(context);
  
  return {
    props: {
      inWMS,
      inOMS,
    }
  }
}
export default Login;