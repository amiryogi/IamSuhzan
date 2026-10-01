import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiChevronLeft,
  HiChevronRight,
  HiShare,
  HiMail,
  HiCheck,
  HiArrowsExpand,
} from "react-icons/hi";
import Modal from "../common/Modal";
import Lightbox from "../common/Lightbox";
import { optimizedImage, formatPrice, formatDimensions } from "../../utils/media";

// Link to the contact form, pre-filled for an enquiry about this artwork
const enquiryLink = (artwork, subject) =>
  `/contact?${new URLSearchParams({ subject, enquire: artwork.title })}`;

const ArtworkDetail = ({ artwork, isOpen, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Arrow keys switch images while the detail view is open
  useEffect(() => {
    const count = artwork?.media?.length || 0;
    if (!isOpen || lightboxOpen || count < 2) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") setCurrentMediaIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setCurrentMediaIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, lightboxOpen, artwork]);

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
    // The page URL carries ?artwork=<slug>, so it opens straight to this piece
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: artwork.title, text: artwork.description, url });
      } catch {
        // Share sheet dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Could not copy link");
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
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="group relative cursor-zoom-in"
                  aria-label="View fullscreen"
                >
                  <img
                    src={optimizedImage(currentMedia?.url, 1600)}
                    alt={artwork.title}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                  />
                  <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-dark/80 flex items-center justify-center text-light opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiArrowsExpand size={18} />
                  </span>
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 
                         rounded-full bg-dark/80 flex items-center justify-center
                         text-light hover:bg-primary hover:text-dark transition-colors"
              >
                <HiChevronLeft size={24} />
              </button>
              <button
                onClick={nextMedia}
                aria-label="Next image"
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
                  aria-label={`Show image ${index + 1}`}
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
              <h2 className="text-3xl font-display font-semibold text-light pr-12">
                {artwork.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share this artwork"
                  className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center
                           text-light-300 hover:bg-primary hover:text-dark transition-colors"
                >
                  <HiShare size={18} />
                </button>
                <Link
                  to={enquiryLink(artwork, "general")}
                  aria-label="Ask about this artwork"
                  className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center
                           text-light-300 hover:bg-primary hover:text-dark transition-colors"
                >
                  <HiMail size={18} />
                </Link>
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
            {formatDimensions(artwork.dimensions) && (
              <div>
                <span className="text-xs text-dark-400 uppercase tracking-wider">
                  Dimensions
                </span>
                <p className="text-light">{formatDimensions(artwork.dimensions)}</p>
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
                    {formatPrice(artwork.price, artwork.currency)}
                  </p>
                </div>
                {artwork.isSold ? (
                  <span className="px-4 py-2 bg-error/20 text-error rounded-full text-sm font-medium">
                    Sold
                  </span>
                ) : (
                  <Link to={enquiryLink(artwork, "purchase")} className="btn btn-primary">
                    Inquire
                  </Link>
                )}
              </div>
            </div>
          )}

          {!artwork.isForSale && (
            <div className="p-4 bg-dark-200 rounded-xl mb-6 flex items-center justify-between gap-4">
              <p className="text-light-300 text-sm">
                Interested in a similar piece? Commissions are open.
              </p>
              <Link
                to={enquiryLink(artwork, "commission")}
                className="btn btn-outline whitespace-nowrap"
              >
                Commission
              </Link>
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
      <Lightbox
        media={media}
        index={currentMediaIndex}
        onIndexChange={setCurrentMediaIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={artwork.title}
      />
    </Modal>
  );
};

export default ArtworkDetail;
