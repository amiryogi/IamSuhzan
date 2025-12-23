import { useState } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import ArtworkDetail from './ArtworkDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import { useArtworks } from '../../hooks/useArtworks';

const Gallery = ({ featured = false, limit = 12, showFilters = true }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { artworks, loading, error } = useArtworks(
    featured ? { featured: true, limit } : { limit }
  );

  const categories = [
    { id: 'all', name: 'All Works' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'still-life', name: 'Still Life' },
  ];

  const filteredArtworks =
    activeCategory === 'all'
      ? artworks
      : artworks.filter(
          (art) =>
            art.category?.slug === activeCategory ||
            art.tags?.includes(activeCategory)
        );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  return (
    <section className="section bg-dark">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mt-2 mb-4">
            {featured ? 'Featured Works' : 'Art Gallery'}
          </h2>
          <p className="text-light-300 max-w-2xl mx-auto">
            A collection of original paintings exploring themes of identity, 
            emotion, and the human experience.
          </p>
        </motion.div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-dark'
                    : 'bg-dark-200 text-light-300 hover:bg-dark-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-light-300">No artworks found in this category.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="masonry-grid"
          >
            {filteredArtworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork._id}
                artwork={artwork}
                index={index}
                onClick={() => setSelectedArtwork(artwork)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Artwork Detail Modal */}
      <ArtworkDetail
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </section>
  );
};

export default Gallery;
