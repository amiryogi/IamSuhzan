import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiStar,
  HiEye,
  HiSearch,
  HiFilter,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { artworksAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ArtworkList = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [artRes, catRes] = await Promise.all([
        artworksAPI.getAll({ limit: 100 }),
        categoriesAPI.getAll(),
      ]);
      setArtworks(artRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await artworksAPI.delete(id);
      setArtworks((prev) => prev.filter((a) => a._id !== id));
      toast.success('Artwork deleted successfully');
    } catch (error) {
      toast.error('Failed to delete artwork');
    }
  };

  const handleToggleFeatured = async (artwork) => {
    try {
      await artworksAPI.update(artwork._id, { featured: !artwork.featured });
      setArtworks((prev) =>
        prev.map((a) =>
          a._id === artwork._id ? { ...a, featured: !a.featured } : a
        )
      );
      toast.success(
        artwork.featured ? 'Removed from featured' : 'Added to featured'
      );
    } catch (error) {
      toast.error('Failed to update artwork');
    }
  };

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || artwork.category?._id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            Artworks
          </h1>
          <p className="text-dark-400 text-sm">
            Manage your portfolio artworks
          </p>
        </div>
        <Link to="/dashboard/artworks/new" className="btn btn-primary gap-2">
          <HiPlus />
          Add Artwork
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn gap-2 ${showFilters ? 'btn-primary' : 'btn-ghost bg-dark-200'}`}
        >
          <HiFilter />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-100 rounded-xl p-4"
          >
            <div className="flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input max-w-xs"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artworks Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 bg-dark-100 rounded-xl">
          <p className="text-dark-400">No artworks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-dark-100 rounded-xl overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={
                    artwork.media?.[0]?.thumbnailUrl ||
                    artwork.media?.[0]?.url ||
                    '/placeholder.jpg'
                  }
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                
                {/* Featured Badge */}
                {artwork.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-dark 
                               text-xs font-medium rounded-full flex items-center gap-1">
                    <HiStar /> Featured
                  </div>
                )}

                {/* Status */}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium 
                              rounded-full ${
                                artwork.status === 'published'
                                  ? 'bg-success text-dark'
                                  : 'bg-dark-400 text-light'
                              }`}>
                  {artwork.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-light truncate mb-1">
                  {artwork.title}
                </h3>
                <p className="text-sm text-dark-400 capitalize">
                  {artwork.medium} • {artwork.year}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-300">
                  <div className="flex items-center gap-1 text-sm text-dark-400">
                    <HiEye />
                    {artwork.views}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFeatured(artwork)}
                      className={`p-2 rounded-lg transition-colors ${
                        artwork.featured
                          ? 'bg-primary text-dark'
                          : 'bg-dark-200 text-light-300 hover:bg-primary hover:text-dark'
                      }`}
                      title={artwork.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <HiStar />
                    </button>
                    <Link
                      to={`/dashboard/artworks/${artwork._id}/edit`}
                      className="p-2 rounded-lg bg-dark-200 text-light-300 
                               hover:bg-blue-500 hover:text-light transition-colors"
                      title="Edit"
                    >
                      <HiPencil />
                    </Link>
                    <button
                      onClick={() => handleDelete(artwork._id)}
                      className="p-2 rounded-lg bg-dark-200 text-light-300 
                               hover:bg-error hover:text-light transition-colors"
                      title="Delete"
                    >
                      <HiTrash />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworkList;
