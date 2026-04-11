import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../global components/footer/Footer'
import { HiX, HiExternalLink, HiAcademicCap } from 'react-icons/hi'
import { usePortfolioData } from '../../context/PortfolioDataContext'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Certificates() {
  const { certificates } = usePortfolioData()
  const [selectedCert, setSelectedCert] = useState(null)

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-bg opacity-30 pointer-events-none" />

      {/* Header Section */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="section-subtitle">Take a look at my</p>
            <h1 className="section-title mb-6">Certificates</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional certifications and achievements that validate my expertise and continuous learning journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="relative pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {certificates.map((item, i) => (
              <motion.div 
                key={item.id} 
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedCert(item.img)}
                className="group relative cursor-pointer"
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500" />
                
                {/* Card */}
                <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden group-hover:border-accent-cyan/30 transition-all duration-500">
                  {/* Certificate Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={item.img} 
                      alt={`Certificate ${i + 1}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-6 py-3 glass rounded-full flex items-center gap-2 text-white font-medium">
                        <HiExternalLink />
                        View Certificate
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
                        <HiAcademicCap className="text-xl text-accent-cyan" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{item.title || 'Professional Certificate'}</h3>
                        <p className="text-xs text-gray-500">Verified Achievement</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state if no certificates */}
          {certificates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <HiAcademicCap className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No certificates to display yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedCert(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            >
              <HiX className="text-2xl" />
            </motion.button>

            {/* Certificate Image */}
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              src={selectedCert}
              alt="Certificate preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
