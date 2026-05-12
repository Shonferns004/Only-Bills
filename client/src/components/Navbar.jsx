import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ReceiptIndianRupee, User, Home, LogOut, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getLocalStorage, deleteLocalStorage } from '../services/Storage';

const Navbar = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getLocalStorage('userDetail');
    setUser(stored);
  }, []);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  const userName = user?.displayName || 'User';
  const userEmail = user?.email || 'user@example.com';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconMotion = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              variants={iconMotion}
              whileHover="hover"
              whileTap="tap"
              onClick={onMenuClick}
              className="p-1.5 sm:p-2 rounded-full text-gray-400 lg:hidden hover:bg-gray-700 hover:text-orange-500 transition-all duration-300"
            >
              <Menu size={22} />
            </motion.button>
            <Link to="/home" className="flex items-center space-x-2 group">
              <motion.div
                variants={iconMotion}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <ReceiptIndianRupee className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full"
                />
              </motion.div>
              <span className="hidden md:inline-block text-lg sm:text-xl font-semibold text-white">
                OnlyBills
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <motion.button 
              variants={iconMotion}
              whileHover="hover"
              whileTap="tap"
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-orange-500" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
            </motion.button>

            <div className="relative" ref={profileRef}>
              <motion.button
                variants={iconMotion}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-orange-600 text-white font-semibold text-base sm:text-lg shadow-lg hover:bg-orange-500 transition-all duration-300"
              >
                {userInitial}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 text-gray-200 font-medium border-b border-gray-700 bg-gray-800/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-lg sm:text-xl font-semibold">
                          {userInitial}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm sm:text-base">{userName}</div>
                          <div className="text-xs sm:text-xs text-gray-400">{userEmail}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 sm:p-2">
                      <Link
                        to="/home"
                        className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-colors group"
                      >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm sm:text-base">Home</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          deleteLocalStorage();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 hover:bg-gray-700/50 rounded-xl transition-colors group"
                      >
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm sm:text-base">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
