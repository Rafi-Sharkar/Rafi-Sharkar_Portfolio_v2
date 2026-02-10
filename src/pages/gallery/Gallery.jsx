import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../global components/footer/Footer'
import { Gallery_01 } from '../../assets/data/data'
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openLightbox = (img, index) => {
    setSelectedImage(img)
    setSelectedIndex(index)
  }

  const closeLightbox = () => setSelectedImage(null)

  const nextImage = () => {
    const newIndex = (selectedIndex + 1) % Gallery_01.length
    setSelectedIndex(newIndex)
    setSelectedImage(Gallery_01[newIndex].img)
  }

  const prevImage = () => {
    const newIndex = selectedIndex === 0 ? Gallery_01.length - 1 : selectedIndex - 1
    setSelectedIndex(newIndex)
    setSelectedImage(Gallery_01[newIndex].img)
  }

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
            <p className="section-subtitle">Show some memories in</p>
            <h1 className="section-title mb-6">Gallery</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A visual journey through memorable moments and experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {Gallery_01.map((item, i) => (
              <motion.div 
                key={i} 
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(item.img, i)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={item.img} 
                  alt={`Gallery image ${i + 1}`} 
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Hover indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                    <span className="text-white text-2xl">+</span>
                  </div>
                </div>
                {/* Border glow effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-cyan/30 rounded-2xl transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            >
              <HiX className="text-2xl" />
            </motion.button>

            {/* Navigation buttons */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            >
              <HiChevronLeft className="text-2xl" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            >
              <HiChevronRight className="text-2xl" />
            </motion.button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 glass rounded-full text-white text-sm">
              {selectedIndex + 1} / {Gallery_01.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
