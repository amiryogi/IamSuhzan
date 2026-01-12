import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiFilter, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { photographyAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lightbox Modal Component
const Lightbox = ({ photo, photos, onClose, onNavigate }) => {
  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p._id === photo._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (hasPrev) onNavigate(photos[currentIndex - 1]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (hasNext) onNavigate(photos[currentIndex + 1]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev)
        onNavigate(photos[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext)
        onNavigate(photos[currentIndex + 1]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 p-4"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-light hover:text-primary transition-colors z-10"
      >
        <HiX size={32} />
      </button>

      {/* Navigation Arrows */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark/50 hover:bg-dark/70 
                   text-light rounded-full backdrop-blur-sm transition-colors z-10"
        >
          <HiChevronLeft size={24} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-dark/50 hover:bg-dark/70 
                   text-light rounded-full backdrop-blur-sm transition-colors z-10"
        >
          <HiChevronRight size={24} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={photo._id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl max-h-[90vh] w-full"
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-display text-light">{photo.title}</h3>
          {photo.category && (
            <span className="text-primary text-sm">{photo.category}</span>
          )}
          {photo.description && (
            <p className="text-dark-400 mt-2 max-w-2xl mx-auto">
              {photo.description}
            </p>
          )}
          <p className="text-dark-500 text-sm mt-2">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PhotographyPage = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await photographyAPI.getAll(params);
      setPhotos(response.data.data);
    } catch (err) {
      console.error("Failed to fetch photography:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await photographyAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Visual Stories
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-light mt-2">
            Photography
          </h1>
          <p className="text-dark-400 mt-4 max-w-2xl mx-auto">
            Explore the world through my lens — a collection of moments frozen
            in time, each telling its own unique story.
          </p>
        </motion.div>

        {/* Filter Bar */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-primary text-dark"
                    : "bg-dark-200 text-light-300 hover:bg-dark-300"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-dark"
                      : "bg-dark-200 text-light-300 hover:bg-dark-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Photo Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No photography works found.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-light font-medium">{photo.title}</h3>
                    {photo.category && (
                      <span className="text-primary text-sm">
                        {photo.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            photos={photos}
            onClose={() => setSelectedPhoto(null)}
            onNavigate={setSelectedPhoto}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographyPage;
