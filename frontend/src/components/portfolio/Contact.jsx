import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiGlobeAlt } from 'react-icons/hi';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import boraImage from '../../assets/bora.jpg';
import { useScroll, useTransform } from 'framer-motion';

const Contact = () => {
  const { publicProfile } = useAuth();
  const profile = publicProfile;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await messagesAPI.send(formData);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <HiMail />, label: 'Email', value: 'iamsulazan@gmail.com', href: 'mailto:iamsulazan@gmail.com' },
    { icon: <HiPhone />, label: 'Phone', value: '+977 9843931831', href: 'tel:+9779843931831' },
    { icon: <HiLocationMarker />, label: 'Location', value: 'Kaldhara, Kathmandu, Nepal' },
  ];

  const socialLinks = [
    profile?.socialLinks?.instagram && { icon: <FaInstagram />, href: profile.socialLinks.instagram, label: 'Instagram' },
    profile?.socialLinks?.facebook && { icon: <FaFacebookF />, href: profile.socialLinks.facebook, label: 'Facebook' },
    profile?.socialLinks?.twitter && { icon: <FaTwitter />, href: profile.socialLinks.twitter, label: 'Twitter' },
    profile?.socialLinks?.youtube && { icon: <FaYoutube />, href: profile.socialLinks.youtube, label: 'YouTube' },
    profile?.socialLinks?.website && { icon: <HiGlobeAlt />, href: profile.socialLinks.website, label: 'Website' },
  ].filter(Boolean);

  if (socialLinks.length === 0 && !profile) {
    socialLinks.push(
      { icon: <FaInstagram />, href: 'https://instagram.com/', label: 'Instagram' },
      { icon: <FaFacebookF />, href: 'https://facebook.com/', label: 'Facebook' }
    );
  }

  return (
    <section className="section relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image with Parallax & Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{
            backgroundImage: `url(${boraImage})`,
            y
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform"
        />
        <div className="absolute inset-0 bg-dark/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mt-2 mb-6">
              Let's Create <br />
              <span className="text-gradient">Something Beautiful</span>
            </h2>
            <p className="text-light-300 mb-8">
              Interested in commissioning a portrait, purchasing artwork, or
              collaborating on a project? I'd love to hear from you. Fill out
              the form and I'll get back to you as soon as possible.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-200 flex items-center 
                               justify-center text-primary text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs text-dark-400 uppercase">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="block text-light hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-light">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <span className="text-sm text-light-300 mb-3 block">Follow me on</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-11 h-11 rounded-full bg-dark-200 flex items-center 
                             justify-center text-light-300 hover:bg-primary 
                             hover:text-dark transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-dark-100 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-light-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-light-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-light-300 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Select a subject</option>
                  <option value="commission">Commission Inquiry</option>
                  <option value="purchase">Purchase Artwork</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="exhibition">Exhibition Inquiry</option>
                  <option value="general">General Question</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-light-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell me about your project or question..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full gap-2 disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    Send Message
                    <HiPaperAirplane />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
