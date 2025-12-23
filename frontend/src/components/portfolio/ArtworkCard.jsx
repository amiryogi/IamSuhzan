import { motion } from 'framer-motion';
import { HiEye, HiHeart } from 'react-icons/hi';

const ArtworkCard = ({ artwork, index, onClick }) => {
  const thumbnail = artwork.media?.[0]?.thumbnailUrl || artwork.media?.[0]?.url || 
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400';
  const isVideo = artwork.media?.[0]?.type === 'video';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="card overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={thumbnail}
            alt={artwork.title}
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

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-dark/80 flex items-center justify-center
                       text-light hover:bg-primary hover:text-dark transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle like
              }}
            >
              <HiHeart size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full bg-dark/80 flex items-center justify-center
                       text-light hover:bg-primary hover:text-dark transition-colors"
            >
              <HiEye size={18} />
            </motion.button>
          </div>

          {/* Price/Status Badge */}
          {artwork.isForSale && !artwork.isSold && (
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-primary text-dark 
                          text-sm font-medium rounded-full">
              ${artwork.price?.toLocaleString()}
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
          {artwork.dimensions && (
            <p className="text-xs text-dark-400 mt-1">
              {artwork.dimensions.width}" × {artwork.dimensions.height}"
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ArtworkCard;
