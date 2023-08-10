import Head from 'next/head';
import { FaSearch } from 'react-icons/fa';
import { indexProfile } from '../../../src/services/api.users';
import { UserProfile } from '../../../src/types';
import Layout from '../../../src/app/layout';
import { FormattedMessage, useIntl } from 'react-intl';
import { showMsg } from '../../../src/helpers';

type HomeProps = {
  profileData: UserProfile;
};

const Inicio = ({ profileData } : HomeProps) => {
  const intl = useIntl()

  const showMessage = () => {
    showMsg('Mostrando mensaje');
  }
  
  return <Layout>
  <Head>
    <title>Don Express Warehouse</title>
    <link rel="icon" href="/icon_favicon.png" />
  </Head>
  <div style={{ background: '#ffeeee' }}>
    <span>Ejemplos de traducciones:</span>
    <div>{ intl.formatMessage({ id: 'title' }) }</div>
    <FormattedMessage id="title"/>
  </div>
  <div className="app" onClick={showMessage}>Dame click para mostrar mensaje <FaSearch /></div>
  <div className="app">{profileData.fullname}</div>
  <style jsx>{`
    .app {
      color: #f4492a;
      font-size: 24px;
      font-family: system-ui, sans-serif;
    }
  `}</style>
</Layout>;
};


export async function getServerSideProps() {
  const profileData = await indexProfile();

  return {
    props: {
      profileData
    }
  }
}

export default Inicio;
