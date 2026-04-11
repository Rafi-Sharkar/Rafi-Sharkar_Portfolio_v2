import React from 'react'
import { motion } from 'framer-motion'
import Footer from '../../global components/footer/Footer'
import ProjectCard from '../../global components/project_card/ProjectCard'
import { usePortfolioData } from '../../context/PortfolioDataContext'

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Projects() {
  const { projects } = usePortfolioData()

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
            <p className="section-subtitle">Take a view of my</p>
            <h1 className="section-title mb-6">Projects</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A collection of projects that showcase my skills in backend development, 
              system design, and full-stack applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={scaleIn}>
                <ProjectCard 
                  img={project.img} 
                  name={project.name} 
                  scode={project.scode} 
                  lnk={project.link} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
