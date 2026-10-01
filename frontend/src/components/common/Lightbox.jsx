import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiX, HiZoomIn, HiZoomOut } from "react-icons/hi";
import { optimizedImage } from "../../utils/media";

// Fullscreen viewer for a list of media items ({ url, type }).
// Keyboard: ←/→ to navigate, Esc to close. Swipe on touch screens.
// Click (or the zoom button) toggles a zoomed view that can be panned by scrolling.
const Lightbox = ({ media, index, onIndexChange, isOpen, onClose, title }) => {
  // Remember which image is zoomed so navigating resets the zoom
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const zoomed = zoomedIndex === index;
  const toggleZoom = () => setZoomedIndex(zoomed ? null : index);
  const current = media[index];
  const isVideo = current?.type === "video";
  const hasMany = media.length > 1;

  const next = () => onIndexChange((index + 1) % media.length);
  const prev = () => onIndexChange((index - 1 + media.length) % media.length);

  const close = () => {
    setZoomedIndex(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowRight" && hasMany) next();
      else if (e.key === "ArrowLeft" && hasMany) prev();
    };
    // Capture phase so the modal underneath doesn't also react
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={title ? `${title} – fullscreen view` : "Fullscreen view"}
        >
          {/* Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {!isVideo && (
              <button
                onClick={toggleZoom}
                className="w-11 h-11 rounded-full bg-dark/80 flex items-center justify-center text-light hover:bg-primary hover:text-dark transition-colors"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <HiZoomOut size={22} /> : <HiZoomIn size={22} />}
              </button>
            )}
            <button
              onClick={close}
              className="w-11 h-11 rounded-full bg-dark/80 flex items-center justify-center text-light hover:bg-primary hover:text-dark transition-colors"
              aria-label="Close fullscreen view"
            >
              <HiX size={22} />
            </button>
          </div>

          {hasMany && (
            <span className="absolute top-6 left-6 text-sm text-light-300">
              {index + 1} / {media.length}
            </span>
          )}

          {/* Media */}
          <div
            className={`w-full h-full flex ${
              zoomed ? "overflow-auto" : "items-center justify-center p-4 md:p-12"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                drag={hasMany && !zoomed ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
                className={zoomed ? "m-auto" : "max-w-full max-h-full flex items-center justify-center"}
              >
                {isVideo ? (
                  <video
                    src={current.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[90vh] rounded-lg"
                  />
                ) : (
                  <img
                    src={optimizedImage(current.url, zoomed ? 3000 : 2000)}
                    alt={title || ""}
                    draggable={false}
                    onClick={toggleZoom}
                    className={
                      zoomed
                        ? "max-w-none w-[200vw] md:w-[160vw] cursor-zoom-out"
                        : "max-w-full max-h-[90vh] object-contain cursor-zoom-in select-none"
                    }
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMany && !zoomed && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark/80 flex items-center justify-center text-light hover:bg-primary hover:text-dark transition-colors"
                aria-label="Previous"
              >
                <HiChevronLeft size={28} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-dark/80 flex items-center justify-center text-light hover:bg-primary hover:text-dark transition-colors"
                aria-label="Next"
              >
                <HiChevronRight size={28} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Lightbox;
