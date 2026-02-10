import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './global components/navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/home/Home'
import Gallery from './pages/gallery/Gallery'
import Certificates from './pages/certificates/Certificates'
import Projects from './pages/projects/Projects'
import Contact from './pages/contact/Contact'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path='/' 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Home />
              </motion.div>
            }
          />
          <Route 
            path='/gallery' 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Gallery />
              </motion.div>
            } 
          />
          <Route 
            path='/certificates' 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Certificates />
              </motion.div>
            } 
          />
          <Route 
            path='/projects' 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Projects />
              </motion.div>
            } 
          />
          <Route 
            path='/contact' 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <Contact />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
