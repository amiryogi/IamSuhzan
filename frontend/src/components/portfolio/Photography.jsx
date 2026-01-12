import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiX } from "react-icons/hi";
import { photographyAPI } from "../../services/api";

// Lightbox Modal Component
const Lightbox = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-light hover:text-primary transition-colors"
      >
        <HiX size={32} />
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl max-h-[90vh] w-full"
      >
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-display text-light">{photo.title}</h3>
          {photo.description && (
            <p className="text-dark-400 mt-2">{photo.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Photography = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await photographyAPI.getLatest(6);
        setPhotos(response.data.data);
      } catch (err) {
        console.error("Failed to fetch photography:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Don't render section if no photos
  if (!loading && photos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-dark-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Photography
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-light mt-2">
            Captured Moments
          </h2>
          <p className="text-dark-400 mt-4 max-w-2xl mx-auto">
            A glimpse into the world through the lens — capturing emotions,
            stories, and fleeting moments in time.
          </p>
        </motion.div>

        {/* Photo Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-dark-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/photography"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light 
                     transition-colors font-medium"
          >
            View All Photography
            <HiArrowRight />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </section>
  );
};

export default Photography;
