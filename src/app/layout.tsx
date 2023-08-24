import React, { useState, useEffect } from 'react'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import '../styles/common.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <div className='flex flex-col min-h-screen w-full'>
        <Header />
        <div className='main flex flex-col'>
          <main className="flex-1">
            <div className="flex flex-row">
              <div className="flex-1" style={{maxWidth: '100%'}}>{children}</div>
            </div>
          </main>
          <Footer />
        </div>
       
      </div>
    </div>
  )
}

export default Layout

