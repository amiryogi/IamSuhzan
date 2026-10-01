import { motion } from 'framer-motion';
import { HiArrowsExpand } from 'react-icons/hi';
import { optimizedImage, imageSrcSet, formatPrice, formatDimensions } from '../../utils/media';

const ArtworkCard = ({ artwork, index, onClick }) => {
  const firstMedia = artwork.media?.[0];
  const isVideo = firstMedia?.type === 'video';
  // Videos use their generated poster frame; images use the full image, resized
  const source = isVideo ? firstMedia?.thumbnailUrl : firstMedia?.url || firstMedia?.thumbnailUrl;
  const thumbnail = source ||
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${artwork.title}`}
      className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <div className="card overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={optimizedImage(thumbnail, 800)}
            srcSet={isVideo ? undefined : imageSrcSet(thumbnail, [400, 800, 1200])}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
            alt={[artwork.title, artwork.medium, artwork.year].filter(Boolean).join(', ')}
            className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-110"
          />
          
          {/* Video Indicator */}
          {isVideo && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-dark/80 rounded text-xs text-light">
              Video
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* View hint */}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-dark/80 flex items-center justify-center
                        text-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <HiArrowsExpand size={18} />
          </div>

          {/* Price/Status Badge */}
          {artwork.isForSale && !artwork.isSold && (
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-dark 
                          text-sm font-medium rounded-full">
              {formatPrice(artwork.price, artwork.currency)}
            </div>
          )}
          {artwork.isSold && (
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-error text-light 
                          text-sm font-medium rounded-full">
              Sold
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-display font-semibold text-light mb-1 
                       group-hover:text-primary transition-colors">
            {artwork.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-light-300">
            <span className="capitalize">{artwork.medium}</span>
            {artwork.year && <span>{artwork.year}</span>}
          </div>
          {formatDimensions(artwork.dimensions) && (
            <p className="text-xs text-dark-400 mt-1">
              {formatDimensions(artwork.dimensions)}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ArtworkCard;
