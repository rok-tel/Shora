'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Language } from '@shora/common/models/types';
import { getDictionary } from '@/i18n/config';

type HeaderProps = {
  locale: Language;
  dict: any;
};

export default function Header({ locale, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Get the current path without the locale prefix
  const currentPath = pathname.replace(`/${locale}`, '') || '/';
  
  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-blue-600">
            Shora
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href={`/${locale}`} 
              className={`${currentPath === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              {dict.nav.home}
            </Link>
            <Link 
              href={`/${locale}/articles`} 
              className={`${currentPath === '/articles' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              {dict.nav.articles}
            </Link>
            <Link 
              href={`/${locale}/stocks`} 
              className={`${currentPath === '/stocks' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              {dict.nav.stocks}
            </Link>
            <Link 
              href={`/${locale}/benefits`} 
              className={`${currentPath === '/benefits' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              {dict.nav.benefits}
            </Link>
          </nav>
          
          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href={pathname.replace(`/${locale}`, '/en')} 
              className={`${locale === 'en' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              EN
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href={pathname.replace(`/${locale}`, '/he')} 
              className={`${locale === 'he' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              עברית
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href={`/${locale}`} 
                className={`${currentPath === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {dict.nav.home}
              </Link>
              <Link 
                href={`/${locale}/articles`} 
                className={`${currentPath === '/articles' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {dict.nav.articles}
              </Link>
              <Link 
                href={`/${locale}/stocks`} 
                className={`${currentPath === '/stocks' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {dict.nav.stocks}
              </Link>
              <Link 
                href={`/${locale}/benefits`} 
                className={`${currentPath === '/benefits' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {dict.nav.benefits}
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-4 pt-2">
                <Link 
                  href={pathname.replace(`/${locale}`, '/en')} 
                  className={`${locale === 'en' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  English
                </Link>
                <Link 
                  href={pathname.replace(`/${locale}`, '/he')} 
                  className={`${locale === 'he' ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  עברית
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
