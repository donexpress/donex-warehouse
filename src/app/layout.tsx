import React, { useState, useEffect } from 'react'
import Header from './components/common/Header';
import SidebarRightMenu from './components/common/SidebarRightMenu';
import Footer from './components/common/Footer';
import '../styles/common.scss';
import { isOMS, isWMS} from '../helpers';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [inOMS, setInOMS] = useState<boolean>(false);
  const [inWMS, setInWMS] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 641px)')
    setInOMS(isOMS());
    setInWMS(isWMS());
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
      <Header onToggleSidebar={toggleSidebar}></Header>
      <main className="flex-1">
        <div className="flex flex-row">
          <SidebarRightMenu isOpen={isOpen} isDesktop={isDesktop} onClose={toggleSidebar} inOms={inOMS} inWms={inWMS}></SidebarRightMenu>
          <div className={ (isDesktop && isOpen) ? "flex-1 p-4 cmp-inside-layout" : "flex-1 p-4" }>{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout

