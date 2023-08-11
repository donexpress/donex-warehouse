import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem, IconButton, Popover, } from "@material-ui/core";
import logoUCorreos from '../../../assets/icons/logo-ucorreos.png';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SelectLanguage from './SelectLanguage';
import { removeAllCookies, getCookie } from '../../../helpers/cookieUtils';
import { UserProfile } from '../../../types';
import { useIntl } from 'react-intl';
import { isOMS, isWMS} from '../../../helpers';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const intl = useIntl()
    const router = useRouter();
    const { locale } = router.query;
    const [anchorEl, setAnchorEl] = useState(null);
    const [profile, setProfile] = useState<UserProfile>({username: ''})
  
    const handleMenuOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const exitApp = () => {
      setAnchorEl(null);
      removeAllCookies();

      if (isWMS()) {
        router.push(`/${locale}/wms/login`);
      } else {
        router.push(`/${locale}/oms/login`);
      }
    };

    useEffect(() => {
      if (isWMS()) {
        const data = getCookie('profileWMS');
        if (data !== undefined) {
          setProfile(data);
        }
      } 
      if (isOMS() !== undefined) {
        const data = getCookie('profileOMS');
        if (data) {
          setProfile(data);
        }
      }

    }, []);
    
    return (
        <header className="bg-gray-800 text-white py-4 header">
          <div className="container-header">
            <div className='flex flex-row justify-start'>
                <button onClick={onToggleSidebar}>
                  <MenuIcon />
                </button>
                <div className='container-header__container-logo'>
                  <Image
                    src={logoUCorreos}
                    alt=''
                    className='container-header__img'
                  />
                </div>
            </div>
            <div className='flex justify-end items-center'>
                <SelectLanguage/>
                <div className='container-header__menu-user'>
                  <div onClick={handleMenuOpen} className='flex justify-start items-center'>
                    <IconButton color="inherit" style={{ padding: '0px 5px 0px 0px', marginBottom: '2px', height: '26px', width: '26px'}}>
                      <AccountCircleIcon style={{ height: '24px', width: '24px' }} />
                    </IconButton>
                    <span className='container-header__username'>{profile.username}</span>
                  </div>

                  <Popover
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    PaperProps={{
                      style: {
                        minWidth: '160px',
                      },
                    }}
                  >
                    <MenuItem onClick={exitApp}>
                      <ExitToAppIcon style={{ marginRight: '8px' }} />
                      { intl.formatMessage({ id: 'exitApp' }) }
                    </MenuItem>
                  </Popover>
                </div>
            </div>
          </div>
        </header>
    );
};
  
export default Header;