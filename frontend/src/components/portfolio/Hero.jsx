import { useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { heroSlidesAPI } from "../../services/api";
import heroImage from "../../assets/heroimage.jpeg";

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await heroSlidesAPI.getAll();
        if (response.data.data && response.data.data.length > 0) {
          setSlides(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch hero slides:", err);
        // Fallback to static image handled by empty slides array
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Get current background image
  const currentImage =
    slides.length > 0 ? slides[currentSlide]?.imageUrl : heroImage;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
        </AnimatePresence>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/60" />
      </motion.div>

      {/* Slide Navigation Arrows (only if multiple slides) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 
                     bg-dark/50 hover:bg-dark/70 text-light rounded-full 
                     backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <HiChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 
                     bg-dark/50 hover:bg-dark/70 text-light rounded-full 
                     backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <HiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span
            className="inline-block px-4 py-2 mb-6 text-sm font-medium text-primary 
                         border border-primary/30 rounded-full bg-dark/50 backdrop-blur-sm"
          >
            Visual Art Portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold mb-6 drop-shadow-2xl"
        >
          <span className="text-light">Sujan</span>
          <br />
          <span className="text-gradient">Budhathoki</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-light-200 max-w-2xl mx-auto mb-10 drop-shadow-lg"
        >
          A young and emerging visual artist of Nepal, known for poetic
          depiction of inner conscience and contemporary conceptual thoughts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/gallery"
            className="btn btn-primary gap-2 text-lg px-8 py-4 shadow-lg shadow-primary/25"
          >
            View Gallery
            <HiArrowRight />
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline text-lg px-8 py-4 backdrop-blur-sm"
          >
            Get in Touch
          </Link>
        </motion.div>
      </motion.div>

      {/* Slide Indicators (only if multiple slides) */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-primary w-6"
                  : "bg-light/50 hover:bg-light/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-light/50 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
