import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import photo_01 from '../../assets/photos/Rafi_tab_icon.png'
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/certificates', label: 'Certificates' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2 glass-dark shadow-lg shadow-dark-900/50' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link to="/" className='relative group'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='relative'
            >
              <img 
                className='w-16 md:w-20 transition-all duration-300 group-hover:brightness-110' 
                src={photo_01} 
                alt='Rafi Sharkar'
              />
              <div className='absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300'/>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-1'>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
              >
                <Link 
                  to={link.path}
                  className={`relative px-4 py-2 text-base font-medium transition-all duration-300 rounded-full group ${
                    location.pathname === link.path 
                      ? 'text-accent-cyan' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Active indicator */}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className='absolute inset-0 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full -z-10'
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Hover effect */}
                  <span className='absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10'/>
                </Link>
              </motion.div>
            ))}
            
            {/* CTA Button */}
            <motion.div
              custom={navLinks.length}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
            >
              <Link 
                to="/contact"
                className='ml-4 px-6 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full font-semibold text-white text-sm transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95'
              >
                Hire Me
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className='md:hidden relative z-50 p-2 text-white'
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiX className='text-3xl text-accent-cyan' />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiMenuAlt3 className='text-3xl' />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className='fixed inset-0 bg-dark-950/80 backdrop-blur-sm md:hidden'
            />
            
            {/* Menu Panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className='fixed top-0 left-0 h-screen w-[280px] bg-dark-900/95 backdrop-blur-xl border-r border-white/10 p-8 pt-24 md:hidden'
            >
              <div className='flex flex-col gap-2'>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'bg-accent-cyan/10 text-accent-cyan border-l-4 border-accent-cyan'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white hover:pl-6'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='mt-6'
                >
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className='block w-full py-3 text-center bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-white transition-transform duration-300 hover:scale-105'
                  >
                    Hire Me
                  </Link>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className='absolute bottom-8 left-8 right-8'>
                <div className='h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent'/>
                <p className='text-center text-xs text-gray-500 mt-4'>
                  © 2025 Rafi Sharkar
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
