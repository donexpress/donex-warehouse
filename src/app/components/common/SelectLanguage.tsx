import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import { Languages, LanguageObj } from '../../../types/index';
import messages from '../../../../messages';
import enFlag from '../../../assets/flags/en.png';
import esFlag from '../../../assets/flags/es.png';
import zhFlag from '../../../assets/flags/zh.png';
import defaultFlag from '../../../assets/flags/default.png';

type LanguageProps = {
  isFromLogin?: boolean;
};

const SelectLanguage = ({ isFromLogin }: LanguageProps) => {
    const router = useRouter();
    const [language, setLanguage] = useState<Languages>("" as Languages);
    const [languages, setLanguages] = useState<LanguageObj[]>([]);
    const { locale } = router.query;
    

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
        case 'zh': return zhFlag;
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
            className={ isFromLogin ? 'selected-language-login' : 'selected-language'}
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
                {isFromLogin && <span>{lang.name}</span>}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    );
};
  
export default SelectLanguage;