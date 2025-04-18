import React from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Layout = ({ children, showHero = false }: props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header /> 
        {showHero && <Hero />} {/* Render Hero only if showHero is true */}
        <div className="container mx-auto flex-1 py-10">{children}</div>
        <Footer />
    </div>
  )
}

type props = {
    children: React.ReactNode;
    showHero?: boolean;
};

export default Layout;