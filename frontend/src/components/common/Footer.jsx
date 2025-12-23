import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaInstagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <FaFacebookF size={18} />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <FaYoutube size={20} />, href: '#', label: 'YouTube' },
  ];

  const footerLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-dark-100 border-t border-dark-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-display font-semibold text-gradient">
                SUHZAN
              </span>
            </Link>
            <p className="text-light-300 text-sm mb-6 max-w-md">
              Fine art artist specializing in portrait painting. Capturing emotions 
              and stories through the timeless medium of paint.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center
                           text-light-300 hover:bg-primary hover:text-dark transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold text-light mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-light-300 text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-display font-semibold text-light mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-light-300">
              <li>hello@suhzan.art</li>
              <li>+1 (555) 123-4567</li>
              <li>Studio Address</li>
              <li>Your City, Country</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-dark-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-light-300 text-sm">
            © {currentYear} Suhzan Fine Art. All rights reserved.
          </p>
          <p className="text-light-300 text-xs">
            Handcrafted with passion for art
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
