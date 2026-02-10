import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'

export default function ProjectCard({ img, name, scode, lnk }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
      
      {/* Card */}
      <div className="relative h-full bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden group-hover:border-accent-cyan/30 transition-all duration-500">
        
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <motion.img 
            src={img} 
            className="w-full h-full object-cover" 
            alt={name}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
          
          {/* Floating Action Buttons */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.a
              href={scode}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-accent-cyan/30 transition-colors duration-300"
            >
              <FaGithub className="text-xl" />
            </motion.a>
            {lnk && lnk !== "" && (
              <motion.a
                href={lnk}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-accent-purple/30 transition-colors duration-300"
              >
                <FaExternalLinkAlt className="text-lg" />
              </motion.a>
            )}
          </motion.div>

          {/* Tech Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-dark-900/80 backdrop-blur-sm border border-white/10 rounded-full text-accent-cyan">
              Project
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-accent-cyan transition-colors duration-300">
            {name}
          </h3>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <a
              href={scode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-dark-700/50 border border-dark-600 hover:border-accent-cyan/50 hover:bg-accent-cyan/10 transition-all duration-300"
            >
              <FaGithub />
              <span className="hidden sm:inline">Code</span>
            </a>
            {lnk && lnk !== "" && (
              <a
                href={lnk}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 hover:from-accent-cyan/30 hover:to-accent-purple/30 transition-all duration-300"
              >
                Live
                <HiArrowRight className="text-accent-cyan" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}