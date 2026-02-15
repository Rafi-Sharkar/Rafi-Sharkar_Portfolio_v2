import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { HiMail, HiLocationMarker, HiPhone, HiUser, HiChat, HiDocumentText, HiCheckCircle, HiXCircle } from "react-icons/hi";
import Footer from '../../global components/footer/Footer';
import emailjs from '@emailjs/browser';

const contactInfo = [
  {
    icon: HiPhone,
    label: 'Phone',
    value: '+8801905493909',
    href: 'tel:+8801905493909',
    color: 'accent-cyan'
  },
  {
    icon: HiMail,
    label: 'Email',
    value: 'rafisharkar144@gmail.com',
    href: 'mailto:rafisharkar144@gmail.com',
    color: 'accent-purple'
  },
  {
    icon: HiLocationMarker,
    label: 'Location',
    value: 'Bashundhara R/A, Dhaka',
    href: null,
    color: 'accent-pink'
  },
  {
    icon: HiLocationMarker,
    label: 'Location 2',
    value: 'Chashara, Narayanganj',
    href: null,
    color: 'accent-emerald'
  }
];

export default function Contact({ showFooter = true }) {
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      await emailjs.send(
        'rafisharkar_portfolio',  // Service ID
        'template_x0dfxw8',  // Template ID
        {
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
        },
        '7i3uMS-5GJiWocOG9'  // Public Key
      );
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setErrorMessage(error?.text || error?.message || 'Unknown error');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Clear status after 10 seconds
      setTimeout(() => setSubmitStatus(null), 10000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`${showFooter ? 'min-h-screen bg-dark-950 pt-24' : ''}`}>
      {/* Background effects */}
      {showFooter && <div className="fixed inset-0 mesh-bg opacity-30 pointer-events-none" />}

      {/* Header Section */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="section-subtitle">Get in touch</p>
            <h2 className="section-title mb-6">Contact Me</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Feel free to reach out!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Let's work together
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    {item.href ? (
                      <a href={item.href} className="block">
                        <ContactCard item={item} />
                      </a>
                    ) : (
                      <ContactCard item={item} />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-dark-700 mt-8"
              >
                <div className="absolute inset-0 bg-dark-800/50 flex items-center justify-center">
                  <div className="text-center">
                    <HiLocationMarker className="text-4xl text-accent-cyan mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Dhaka, Bangladesh</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-accent-purple/5" />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-3xl opacity-20 blur-xl" />
                
                {/* Form Card */}
                <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-3xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Send a message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="relative">
                      <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all duration-300"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all duration-300"
                      />
                    </div>

                    {/* Subject Input */}
                    <div className="relative">
                      <HiDocumentText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all duration-300"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="relative">
                      <HiChat className="absolute left-4 top-4 text-gray-500" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        rows={5}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-glow transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400"
                      >
                        <HiCheckCircle className="text-xl flex-shrink-0" />
                        <span>Message sent successfully! I'll get back to you soon.</span>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
                      >
                        <div className="flex items-center gap-2">
                          <HiXCircle className="text-xl flex-shrink-0" />
                          <span>Failed to send message. Please try again or email me directly.</span>
                        </div>
                        {errorMessage && (
                          <p className="text-xs text-red-400/70 ml-7">Error: {errorMessage}</p>
                        )}
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {showFooter && <Footer />}
    </div>
  )
}

// Contact Card Component
function ContactCard({ item }) {
  return (
    <div className="p-5 bg-dark-800/50 border border-dark-700 rounded-2xl group-hover:border-accent-cyan/30 group-hover:bg-dark-800 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center flex-shrink-0`}>
          <item.icon className={`text-xl text-${item.color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-white text-sm font-medium truncate group-hover:text-accent-cyan transition-colors duration-300">
            {item.value}
          </p>
        </div>
      </div>
    </div>
  )
}
