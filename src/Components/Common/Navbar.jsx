import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  Menu,
  X,
  ChevronDown,
  Briefcase,
  BookMarked,
  Settings,
  LayoutDashboard,
  CircleUser,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/app");

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem("userId", user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("userId");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Key Features", href: "/features" },
    { label: "About", href: "/about" },
    { label: "Benefits", href: "/benefits" },
  ];

  const accountItems = [
    {
      label: "Dashboard",
      href: "/app",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Profile",
      href: "/app/profile",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  if (isDashboard) {
    return (
      <nav  className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
                  Budget<span className="text-[#6366f1] ml-1">Buddy</span>
                </span>
              </Link>
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Budget<span className="text-[#6366f1] ml-1">Buddy</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/app">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
                  Log in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <UserButton />
                  {isLoaded && user && (
                    <span className="text-gray-700 font-medium">
                      {user.firstName || user.fullName || "User"}
                    </span>
                  )}
                </div>

                {/* Account Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={toggleDropdown}
                    className="flex items-center cursor-pointer text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <CircleUser className="w-6 h-6 text-red-600" />
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <ul className="py-2">
                        {accountItems.map((item, index) => (
                          <li key={index}>
                            <Link
                              to={item.href}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.icon}
                              <span className="ml-2">{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/dashboard">
                <button className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
                  Log in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="space-y-2">
                {accountItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ))}
                <div className="flex items-center space-x-2 px-3 py-2">
                  <UserButton />
                  {isLoaded && user && (
                    <span className="text-gray-700 font-medium">
                      {user.firstName || user.fullName || "User"}
                    </span>
                  )}
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
