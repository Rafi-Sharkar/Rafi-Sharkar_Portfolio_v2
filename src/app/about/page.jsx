'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { WorkExperiences } from '@/assets/data/data';
import { usePortfolioData } from '@/context/PortfolioDataProvider';
import { HiCheckCircle } from 'react-icons/hi';

export default function AboutPage() {
  const { profile, experiences } = usePortfolioData();

  const expList = experiences || WorkExperiences;
  const jobTitle = profile?.jobTitle || 'System Design and Backend Engineer';
  const aboutP1 =
    profile?.aboutP1 ||
    'I am Mustakim Billah Rafi, a System Design and Backend Engineer with expertise in building scalable microservices, database schema design, and high-performance backend systems. I work with Node.js, NestJS, PostgreSQL, Redis, and AWS to architect multi-tenant production platforms with 99.9% uptime.';
  const aboutP2 =
    profile?.aboutP2 ||
    'Experienced in leading end-to-end architecture decisions, designing REST API endpoints secured with JWT/OAuth2 and RBAC, driving CI/CD containerization strategies, and building real-time event systems with WebSockets and BullMQ.';

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="section-subtitle">Background & Journey</p>
            <h1 className="section-title mb-4">About & Experience</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              {jobTitle} with a proven track record in microservices architecture, system design, and building reliable backend platforms.
            </p>
          </motion.div>

          {/* Bio Overview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card mb-16 max-w-4xl mx-auto border border-accent-cyan/20"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Professional Summary</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{aboutP1}</p>
            <p className="text-gray-300 leading-relaxed">{aboutP2}</p>
          </motion.div>

          {/* Experience Timeline Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-subtitle">Career Progression</p>
            <h2 className="text-3xl font-bold text-white">Work History</h2>
          </motion.div>

          {/* Timeline List */}
          <div className="relative border-l-2 border-accent-cyan/30 ml-4 sm:ml-8 md:ml-24 pl-6 sm:pl-8 space-y-12 max-w-5xl mx-auto">
            {expList.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-dark-950 border-2 border-accent-cyan group-hover:border-accent-purple group-hover:scale-125 transition-all duration-300 shadow-lg shadow-accent-cyan/50" />

                <div className="card hover:border-accent-cyan/40 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent-cyan transition-colors">
                          {item.role}
                        </h3>
                        {item.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Present Role
                          </span>
                        )}
                      </div>
                      <p className="text-accent-purple font-medium text-sm sm:text-base mt-1">
                        {item.company} <span className="text-gray-500">• {item.location}</span>
                      </p>
                    </div>
                    <span className="self-start md:self-center px-4 py-1.5 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 shrink-0">
                      {item.period}
                    </span>
                  </div>

                  {/* Key Skills */}
                  {item.keySkills && item.keySkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.keySkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-dark-800 text-gray-300 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 text-gray-300 text-sm sm:text-base">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <HiCheckCircle className="text-accent-cyan text-base shrink-0 mt-1" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}