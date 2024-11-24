import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-lg font-bold text-blue-500"
            >
              Crypto
            </NavLink>
          </div>

          {/* Menu Section (Desktop) */}
          <div className="hidden md:flex space-x-4">
            <DarkModeToggle />

            <NavLink
              to="/"
              className={({ isActive }) => {
                console.log(`Is active: ${isActive}`);
                return `text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"}`;
              }}
            >
              Wallet
            </NavLink>
            <NavLink
              to="/tokenManagement"
              className={({ isActive }) => {
                console.log(`Is active: ${isActive}`);
                return `text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"}`;
              }}
            >
              Token
            </NavLink>
            <NavLink
              to="/orderBook"
              className={({ isActive }) => {
                console.log(`Is active: ${isActive}`);
                return `text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"}`;
              }}
            >
              Order Book
            </NavLink>
            <NavLink
              to="/exchangeRate"
              className={({ isActive }) => {
                console.log(`Is active: ${isActive}`);
                return `text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-700 font-semibold" : "hover:text-blue-500"}`;
              }}
            >
              Exchange Rate
            </NavLink>
            <NavLink
              to="/swapToken"
              className={({ isActive }) => {
                console.log(`Is active: ${isActive}`);
                return `text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-blue-700 font-semibold" : "hover:text-blue-500"}`;
              }}
            >
              Token Swap
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
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
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <NavLink
            to="/"
            className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Wallet
          </NavLink>
          <NavLink
            to="/tokenManagement"
            className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Token
          </NavLink>
          <NavLink
            to="/orderBook"
            className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Order Book
          </NavLink>
          <NavLink
            to="/exchangeRate"
            className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Exchange Rate
          </NavLink>
          <NavLink
            to="/swapToken"
            className="text-gray-700 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
          >
            Token Swap
          </NavLink>
          {/*  */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
