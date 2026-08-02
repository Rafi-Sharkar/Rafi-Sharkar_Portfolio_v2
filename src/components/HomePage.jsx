'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaGithub, FaDownload } from 'react-icons/fa';
import {
  HiArrowRight,
  HiAcademicCap,
  HiBriefcase,
  HiCode,
  HiDatabase,
  HiCog,
  HiChip,
} from 'react-icons/hi';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Self } from '@/assets/data/data';
import { usePortfolioData } from '@/context/PortfolioDataProvider';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const getExperience = (startDate) => {
  if (!startDate) return { years: 0, months: 0 };
  const start = new Date(startDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (now.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  return { years, months };
};

const FALLBACK_EXPERIENCE = '2025-07-01';

function SkillCard({ title, items, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="skill-card group"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 group-hover:from-accent-cyan/30 group-hover:to-accent-purple/30 transition-all duration-300">
          <Icon className="text-2xl text-accent-cyan group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={`${title}-${item.name}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple" />
            <div>
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.level}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { projects, skills, profile } = usePortfolioData();

  const name = profile?.name || Self.name;
  const firstName = name.split(' ')[0];
  const restName = name.split(' ').slice(1).join(' ');
  const jobTitle = profile?.jobTitle || Self.job_title;
  const heroSubtitle = profile?.heroSubtitle || 'Hello, I am';
  const heroTagline =
    profile?.heroTagline ||
    'Building scalable and high-performance backend systems with NestJS, designing efficient and reliable databases using PostgreSQL and exploring AI integration into systems to create smarter digital solutions.';
  const profilePic = profile?.profilePic || Self.profile_pic;
  const coverPic = profile?.coverPic || Self.cover_pic;
  const cvUrl = profile?.cvUrl || Self.CV_down;
  const githubUrl = profile?.githubUrl || Self.GH_link;
  const linkedinUrl = profile?.linkedinUrl || Self.LI_link;
  const aboutP1 =
    profile?.aboutP1 ||
    'I am Mustakim Billah Rafi, a full-stack developer with expertise in backend development, database management, and system design. I work with NestJS to build scalable microservices, manage PostgreSQL for efficient data handling, and design reliable software architectures.';
  const aboutP2 =
    profile?.aboutP2 ||
    'I have a strong interest in AI and Machine Learning, particularly in exploring how AI agents can effectively integrate with software systems using MCP servers. Currently pursuing a BSc in Computer Science and Engineering, I am expanding my skills in DevOps.';
  const quote = profile?.quote || 'Code with scalability, design with purpose, and learn without limits.';
  const experienceStart = profile?.experienceStartDate || FALLBACK_EXPERIENCE;

  const expFormatted = useMemo(() => {
    const { years, months } = getExperience(experienceStart);
    return `${years}Y ${months}M`;
  }, [experienceStart]);

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 mesh-bg" />

        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="floating-shape w-72 h-72 bg-accent-cyan top-20 left-10"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="floating-shape w-96 h-96 bg-accent-purple bottom-20 right-10"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="floating-shape w-48 h-48 bg-accent-pink top-1/2 left-1/3"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink opacity-50 blur-3xl animate-pulse-slow" />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-accent-cyan/30"
                />

                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-dark-800 shadow-2xl shadow-accent-cyan/20">
                  <img
                    className="w-full h-full object-cover object-top scale-120"
                    src={profilePic}
                    alt={name}
                  />
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-4 top-8 px-4 py-2 glass rounded-full text-sm font-medium text-accent-cyan"
                >
                  Backend Dev
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -left-4 bottom-16 px-4 py-2 glass rounded-full text-sm font-medium text-accent-purple"
                >
                  Full Stack
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left max-w-xl order-2 lg:order-1"
            >
              <motion.p variants={fadeInUp} className="section-subtitle">
                {heroSubtitle}
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-4"
              >
                <span className="text-white">{firstName} </span>
                <span className="gradient-text">{restName}</span>
              </motion.h1>

              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start gap-2 mb-6"
              >
                <div className="h-px w-8 bg-accent-cyan" />
                <h2 className="text-xl sm:text-2xl font-medium text-gray-400">{jobTitle}</h2>
                <div className="h-px w-8 bg-accent-purple" />
              </motion.div>

              <motion.p variants={fadeInUp} className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
                {heroTagline}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
              >
                <motion.a
                  href={cvUrl}
                  download="MUSTAKIM_BILLAH_RAFI"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <FaDownload className="text-sm" />
                  Download CV
                </motion.a>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    Let us Talk
                    <HiArrowRight />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start gap-4"
              >
                <span className="text-sm text-gray-500">Find me on</span>
                <div className="flex gap-3">
                  {linkedinUrl && (
                    <motion.a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent-cyan hover:bg-accent-cyan/20 transition-colors duration-300"
                    >
                      <FaLinkedinIn />
                    </motion.a>
                  )}
                  {githubUrl && (
                    <motion.a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent-purple hover:bg-accent-purple/20 transition-colors duration-300"
                    >
                      <FaGithub />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-500 text-sm"
            >
              <span>Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center p-2">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-accent-cyan"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="section-subtitle">Get To Know More</p>
            <h2 className="section-title">About Me</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto lg:mx-0"
            >
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-cyan to-accent-purple opacity-20 blur-2xl" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
                  <img className="w-full h-full object-cover object-top" src={coverPic} alt="About" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -bottom-6 -right-6 w-28 h-28 rounded-2xl glass flex flex-col items-center justify-center"
                >
                  <span className="text-3xl font-bold gradient-text">{expFormatted}</span>
                  <span className="text-xs text-gray-400">Experience</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: HiBriefcase, label: 'Experience', value: expFormatted, sub: 'Backend & System Design' },
                  { icon: HiCode, label: 'Frontend', value: expFormatted, sub: 'React & Next.js' },
                  { icon: HiAcademicCap, label: 'Education', value: 'B.Sc CSE', sub: 'IUB, Bangladesh' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="card text-center"
                  >
                    <item.icon className="text-2xl text-accent-cyan mx-auto mb-2" />
                    <h4 className="font-semibold text-white">{item.value}</h4>
                    <p className="text-xs text-gray-400">{item.sub}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">{aboutP1}</p>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">{aboutP2}</p>

              <blockquote className="relative pl-6 border-l-2 border-accent-cyan">
                <p className="text-gray-300 italic">"{quote}"</p>
                <footer className="mt-2 text-sm text-accent-cyan">- {name}</footer>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-dark-900/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="section-subtitle">Explore My</p>
            <h2 className="section-title">Skills & Expertise</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard title="Languages" items={skills.languages} icon={HiCode} delay={0} />
            <SkillCard title="Frameworks" items={skills.frameworks} icon={HiChip} delay={0.1} />
            <SkillCard title="Databases" items={skills.databases} icon={HiDatabase} delay={0.2} />
            <SkillCard title="Tools & Other" items={skills.tools} icon={HiCog} delay={0.3} />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="section-subtitle">Browse My Recent</p>
            <h2 className="section-title">Projects</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {projects.slice(0, 3).map((project) => (
              <motion.div key={project.id} variants={scaleIn}>
                <ProjectCard img={project.img} name={project.name} scode={project.scode} lnk={project.link} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/10 transition-all duration-300"
            >
              View All Projects
              <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative">
        <ContactForm showFooter={false} />
      </section>

      <Footer />
    </div>
  );
}
