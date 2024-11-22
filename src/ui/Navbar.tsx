import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="/" className="text-lg font-bold text-blue-500">
            Crypto
            </a>
          </div>

          {/* Menu Section (Desktop) */}
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
              Wallet
            </NavLink>
            <NavLink to="/tokenManagement" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
              Token
            </NavLink>
            <NavLink to="/orderBook" className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">
              Order Book
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
              onClick={toggleMenu}
            >
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
           <NavLink to="/" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
              Wallet
            </NavLink>
            <NavLink to="/tokenManagement" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
              Token
            </NavLink>
            <NavLink to="/orderBook" className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">
              Order Book
            </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
