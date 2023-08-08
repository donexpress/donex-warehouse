import React, { useState, createContext, useContext, ReactNode } from 'react'

interface Props {
    children: ReactNode;
}

interface LanguageContextProps {
    language: string;
    changeLanguage: (newLanguage: string) => void;
}
  
const LanguageContext = createContext<LanguageContextProps>({
    language: 'en',
    changeLanguage: () => {}
})

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<string>('en') // idioma predeterminado

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)