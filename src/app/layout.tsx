import React, { useState, useEffect } from 'react'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import '../styles/common.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 641px)')
    setIsDesktop(mediaQuery.matches)
    if (mediaQuery.matches) {
      setIsOpen(true);
    }

    const handleResize = () => {
      setIsDesktop(mediaQuery.matches)
      if (mediaQuery.matches) {
        setIsOpen(true);
      }
    }
    mediaQuery.addEventListener('change', handleResize)

    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="flex flex-row">
          <div className="flex-1 body-background">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout

