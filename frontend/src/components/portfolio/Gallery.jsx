import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import ArtworkDetail from './ArtworkDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import { useArtworks } from '../../hooks/useArtworks';
import { useAuth } from '../../context/AuthContext';
import { artworksAPI } from '../../services/api';

const Gallery = ({ featured = false, limit = 12, showFilters = true }) => {
  const { categories: globalCategories } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // True when the open artwork was pushed onto history by this page
  const openedHere = useRef(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const openSlug = searchParams.get('artwork');

  const displayCategories = [
    { id: 'all', name: 'All Works' },
    ...globalCategories.map(cat => ({
      id: cat.slug,
      name: cat.name
    }))
  ];

  const { artworks, loading, error } = useArtworks(
    featured ? { featured: true, limit } : { limit }
  );


  // The open artwork lives in the URL (?artwork=<slug>) so it can be shared
  // and the browser back button closes it
  useEffect(() => {
    if (!openSlug) {
      openedHere.current = false;
      setSelectedArtwork(null);
      return;
    }
    if (selectedArtwork?.slug === openSlug) return;

    const loaded = artworks.find((art) => art.slug === openSlug);
    if (loaded) {
      setSelectedArtwork(loaded);
      return;
    }

    let cancelled = false;
    artworksAPI
      .getBySlug(openSlug)
      .then((res) => !cancelled && setSelectedArtwork(res.data.data))
      .catch(() => !cancelled && closeArtwork());
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSlug, artworks]);

  // Show the artwork's title in the browser tab while it is open
  useEffect(() => {
    if (!selectedArtwork) return;
    const previous = document.title;
    document.title = `${selectedArtwork.title} | Sujan Budhathoki`;
    return () => {
      document.title = previous;
    };
  }, [selectedArtwork]);

  const openArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    openedHere.current = true;
    const next = new URLSearchParams(searchParams);
    next.set('artwork', artwork.slug);
    setSearchParams(next, { preventScrollReset: true });
  };

  const closeArtwork = () => {
    setSelectedArtwork(null);
    if (openedHere.current) {
      // Step back so the browser Back button doesn't reopen it
      openedHere.current = false;
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete('artwork');
    setSearchParams(next, { replace: true, preventScrollReset: true });
  };

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
          viewport={{ once: true, amount: 0.2 }}
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
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
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
                onClick={() => openArtwork(artwork)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Artwork Detail Modal */}
      {/* Keyed so each artwork opens on its first image */}
      <ArtworkDetail
        key={selectedArtwork?._id}
        artwork={selectedArtwork}
        isOpen={!!selectedArtwork}
        onClose={closeArtwork}
      />
    </section>
  );
};

export default Gallery;
