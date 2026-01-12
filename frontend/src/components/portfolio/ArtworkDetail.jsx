import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiX,
  HiShare,
  HiMail,
  HiCheck,
} from "react-icons/hi";
import Modal from "../common/Modal";

const ArtworkDetail = ({ artwork, isOpen, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (!artwork) return null;

  const media = artwork.media || [];
  const currentMedia = media[currentMediaIndex];
  const isVideo = currentMedia?.type === "video";

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: artwork.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Media Section */}
        <div className="relative bg-dark-200 flex items-center justify-center">
          {/* Main Media */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMediaIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              {isVideo ? (
                <video
                  src={currentMedia?.url}
                  controls
                  className="max-w-full max-h-[60vh] rounded-lg"
                />
              ) : (
                <img
                  src={currentMedia?.url}
                  alt={artwork.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 
                         rounded-full bg-dark/80 flex items-center justify-center
                         text-light hover:bg-primary hover:text-dark transition-colors"
              >
                <HiChevronLeft size={24} />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 
                         rounded-full bg-dark/80 flex items-center justify-center
                         text-light hover:bg-primary hover:text-dark transition-colors"
              >
                <HiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Media Indicators */}
          {media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMediaIndex ? "bg-primary" : "bg-dark-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-3xl font-display font-semibold text-light">
                {artwork.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center
                           text-light-300 hover:bg-primary hover:text-dark transition-colors"
                >
                  <HiShare size={18} />
                </button>
                <a
                  href={`mailto:hello@suhzan.art?subject=Inquiry about ${artwork.title}`}
                  className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center
                           text-light-300 hover:bg-primary hover:text-dark transition-colors"
                >
                  <HiMail size={18} />
                </a>
              </div>
            </div>

            {artwork.year && <p className="text-light-300">{artwork.year}</p>}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {artwork.medium && (
              <div>
                <span className="text-xs text-dark-400 uppercase tracking-wider">
                  Medium
                </span>
                <p className="text-light capitalize">{artwork.medium}</p>
              </div>
            )}
            {artwork.surface && (
              <div>
                <span className="text-xs text-dark-400 uppercase tracking-wider">
                  Surface
                </span>
                <p className="text-light capitalize">{artwork.surface}</p>
              </div>
            )}
            {artwork.dimensions && (
              <div>
                <span className="text-xs text-dark-400 uppercase tracking-wider">
                  Dimensions
                </span>
                <p className="text-light">
                  {artwork.dimensions.width}" × {artwork.dimensions.height}"
                </p>
              </div>
            )}
            {artwork.category && (
              <div>
                <span className="text-xs text-dark-400 uppercase tracking-wider">
                  Category
                </span>
                <p className="text-light">{artwork.category.name}</p>
              </div>
            )}
          </div>

          {/* Price & Availability */}
          {artwork.isForSale && (
            <div className="p-4 bg-dark-200 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-dark-400 uppercase tracking-wider">
                    Price
                  </span>
                  <p className="text-2xl font-semibold text-primary">
                    ${artwork.price?.toLocaleString()} {artwork.currency}
                  </p>
                </div>
                {artwork.isSold ? (
                  <span className="px-4 py-2 bg-error/20 text-error rounded-full text-sm font-medium">
                    Sold
                  </span>
                ) : (
                  <a
                    href={`mailto:hello@suhzan.art?subject=Purchase Inquiry: ${artwork.title}`}
                    className="btn btn-primary"
                  >
                    Inquire
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {artwork.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-light mb-2">
                About this piece
              </h3>
              <p className="text-light-300 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          )}

          {/* Competition Info */}
          {artwork.competition?.name && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl mb-6">
              <span className="text-xs text-primary uppercase tracking-wider">
                Competition Entry
              </span>
              <p className="text-light font-medium">
                {artwork.competition.name}
              </p>
              {artwork.competition.award && (
                <p className="text-primary text-sm">
                  {artwork.competition.award}
                </p>
              )}
            </div>
          )}

          {/* Features */}
          {artwork.features && artwork.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-light mb-3">
                Key Features
              </h3>
              <div className="space-y-2">
                {artwork.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-dark-200 rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HiCheck className="text-primary text-xs" />
                    </div>
                    <div>
                      <p className="text-light font-medium">{feature.title}</p>
                      {feature.description && (
                        <p className="text-light-300 text-sm mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-dark-200 rounded-full text-xs text-light-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ArtworkDetail;
