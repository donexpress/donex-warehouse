import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem, Select, FormControl, InputLabel, makeStyles,
  IconButton,
  Popover, } from "@material-ui/core";
import messages from '../../../../messages';
import { Languages, LanguageObj } from '../../../types/index';
import enFlag from '../../../assets/flags/en.png';
import esFlag from '../../../assets/flags/es.png';
import defaultFlag from '../../../assets/flags/default.png';
import logoUCorreos from '../../../assets/icons/logo-ucorreos.png';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const router = useRouter();
    const [language, setLanguage] = useState<Languages>("" as Languages);
    const [languages, setLanguages] = useState<LanguageObj[]>([]);
    const { locale } = router.query;
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleMenuOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      handleMenuClose();
    };

    useEffect(() => {
      if (locale !== undefined) {
        let lcls: LanguageObj[] = [];
        const langs: Languages[] = Object.keys(messages) as Languages[];
        langs.forEach(lang => {
          const msgs = messages[lang];
          
          lcls.push({
            code: lang,
            name: msgs.localeFullName,
            flag: getImage(lang),
          });
        });
        setLanguages(lcls);

        const language: string | undefined = Array.isArray(locale) ? locale[0] : locale;
        setLanguage(language  as Languages);
      }
    }, [locale]);

    const getImage = (lang: Languages) => {
      switch(lang) {
        case 'en': return enFlag;
        case 'es': return esFlag;
      }
      return defaultFlag;
    };

    const handleChange = (event: any) => {
        // @ts-ignore
      const value = event.target.value;
      if (language !== value) {
        const { asPath } = router;
        const newRoute = asPath.replace(language, value);
        setLanguage(value);
        router.replace(newRoute);
      }
    };
    return (
        <header className="bg-gray-800 text-white py-4 header">
          {/* Aquí puedes definir el contenido del header */}
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
                <FormControl>
                  <InputLabel htmlFor="language-select"></InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => {handleChange(e)}}
                    inputProps={{
                      name: "language",
                      id: "language-select",
                    }}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                    className="selected-language"
                  >
                    {languages.length === 0 &&
                      <MenuItem value="">
                        <Image
                          src={defaultFlag}
                          alt=''
                          width="24"
                          height="24"
                          className="mr-2"
                        />
                        <span>{'Idioma'}</span>
                      </MenuItem>
                    }
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        <Image
                          src={lang.flag}
                          alt=''
                          width="24"
                          height="24"
                          className="mr-2"
                        />
                        <span>{lang.name}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className='container-header__menu-user'>
                  <div onClick={handleMenuOpen} className='flex justify-start items-center'>
                    <IconButton color="inherit" style={{ padding: '0px 5px 0px 0px', marginBottom: '2px', height: '26px', width: '26px'}}>
                      <AccountCircleIcon style={{ height: '24px', width: '24px' }} />
                    </IconButton>
                    <span className='container-header__username'>Nombre de Usuario</span>
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
                    <MenuItem onClick={handleMenuClose}>
                      <ExitToAppIcon style={{ marginRight: '8px' }} />
                      Salir
                    </MenuItem>
                  </Popover>
                </div>
            </div>
          </div>
        </header>
    );
};
  
export default Header;