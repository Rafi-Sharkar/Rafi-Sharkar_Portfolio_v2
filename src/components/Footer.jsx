'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaHeart,
} from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { Self } from '@/assets/data/data';
import { usePortfolioData } from '@/context/PortfolioDataProvider';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { profile } = usePortfolioData();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/certificates', label: 'Certificates' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  const githubUrl = profile?.githubUrl || Self.GH_link;
  const linkedinUrl = profile?.linkedinUrl || Self.LI_link;
  const facebookUrl = profile?.facebookUrl || Self.FB_link;
  const instagramUrl = profile?.instagramUrl || Self.IG_link;

  const socialLinks = [
    { icon: FaFacebook, href: facebookUrl, label: 'Facebook' },
    { icon: FaInstagram, href: instagramUrl, label: 'Instagram' },
    { icon: FaLinkedin, href: linkedinUrl, label: 'LinkedIn' },
    { icon: FaGithub, href: githubUrl, label: 'GitHub' },
  ].filter((social) => social.href);

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-950" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-accent-purple/5 rounded-full blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Link href="/" className="inline-block mb-6">
                <img className="w-16 h-16 rounded-xl" src="/photos/Rafi_tab_icon.png" alt="Rafi Sharkar" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {profile?.bio || 'Skilled in communication, teamwork, and time management. Building scalable solutions with passion and precision.'}
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={`${social.label}-${i}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-300"
                  >
                    <social.icon className="text-lg" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-white font-semibold mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link, i) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-gray-400 text-sm hover:text-accent-cyan transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-accent-cyan transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-white font-semibold mb-6 relative inline-block">
                Location
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <HiLocationMarker className="text-accent-cyan mt-1 flex-shrink-0" />
                  <div className="text-gray-400 text-sm whitespace-pre-line">
                    {profile?.mapLabel || 'Bangladesh'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-white font-semibold mb-6 relative inline-block">
                Stay Connected
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get updates on my latest projects and tech insights.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm text-center sm:text-left">
                © {currentYear} {profile?.name || 'Rafi Sharkar'}. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                Made with <FaHeart className="text-accent-pink animate-pulse" /> using Next.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
