import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiSave, HiTrash, HiPlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { artworksAPI, categoriesAPI } from '../../services/api';
import MediaUploader from './MediaUploader';
import LoadingSpinner from '../common/LoadingSpinner';

const ArtworkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: 'oil',
    surface: 'canvas',
    dimensions: { width: '', height: '', unit: 'inches' },
    year: new Date().getFullYear(),
    price: '',
    currency: 'USD',
    isForSale: false,
    isSold: false,
    category: '',
    tags: '',
    media: [],
    featured: false,
    status: 'published',
    competition: { name: '', year: '', award: '', position: '' },
    features: [],
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchArtwork();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArtwork = async () => {
    try {
      const res = await artworksAPI.getById(id);
      const artwork = res.data.data;
      setFormData({
        ...artwork,
        tags: artwork.tags?.join(', ') || '',
        category: artwork.category?._id || '',
        dimensions: artwork.dimensions || { width: '', height: '', unit: 'inches' },
        features: artwork.features || [],
        competition: artwork.competition || { name: '', year: '', award: '', position: '' },
      });
    } catch (error) {
      toast.error('Failed to load artwork');
      navigate('/dashboard/artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleMediaUpload = (uploadedMedia) => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...uploadedMedia],
    }));
  };

  const removeMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };
// Feature management functions
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', description: '' }],
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        category: formData.category || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        dimensions: {
          ...formData.dimensions,
          width: Number(formData.dimensions.width) || undefined,
          height: Number(formData.dimensions.height) || undefined,
        },
      };

      if (isEdit) {
        await artworksAPI.update(id, payload);
        toast.success('Artwork updated successfully');
      } else {
        await artworksAPI.create(payload);
        toast.success('Artwork created successfully');
      }
      navigate('/dashboard/artworks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save artwork');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/artworks')}
          className="p-2 rounded-lg bg-dark-200 text-light-300 hover:bg-dark-300 transition-colors"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            {isEdit ? 'Edit Artwork' : 'Add New Artwork'}
          </h1>
          <p className="text-dark-400 text-sm">
            {isEdit ? 'Update artwork details' : 'Create a new portfolio piece'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Media Section */}
        <section className="bg-dark-100 rounded-xl p-6">
          <h2 className="text-lg font-medium text-light mb-4">Media</h2>
          
          {/* Existing Media */}
          {formData.media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {formData.media.map((item, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.thumbnailUrl || item.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error 
                             flex items-center justify-center text-light"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <MediaUploader onUploadComplete={handleMediaUpload} />
        </section>

        {/* Basic Info */}
        <section className="bg-dark-100 rounded-xl p-6">
          <h2 className="text-lg font-medium text-light mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-light-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter artwork title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-light-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input resize-none"
                placeholder="Describe your artwork..."
              />
            </div>

            <div>
              <label className="block text-sm text-light-300 mb-2">Medium</label>
              <select name="medium" value={formData.medium} onChange={handleChange} className="input">
                <option value="oil">Oil</option>
                <option value="acrylic">Acrylic</option>
                <option value="watercolor">Watercolor</option>
                <option value="charcoal">Charcoal</option>
                <option value="pencil">Pencil</option>
                <option value="pastel">Pastel</option>
                <option value="mixed-media">Mixed Media</option>
                <option value="digital">Digital</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-light-300 mb-2">Surface</label>
              <select name="surface" value={formData.surface} onChange={handleChange} className="input">
                <option value="canvas">Canvas</option>
                <option value="paper">Paper</option>
                <option value="wood">Wood</option>
                <option value="board">Board</option>
                <option value="digital">Digital</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-light-300 mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm text-light-300 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Dimensions & Pricing */}
        <section className="bg-dark-100 rounded-xl p-6">
          <h2 className="text-lg font-medium text-light mb-4">Dimensions & Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm text-light-300 mb-2">Width</label>
              <input
                type="number"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-light-300 mb-2">Height</label>
              <input
                type="number"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-light-300 mb-2">Unit</label>
              <select name="dimensions.unit" value={formData.dimensions.unit} onChange={handleChange} className="input">
                <option value="inches">Inches</option>
                <option value="cm">Centimeters</option>
                <option value="pixels">Pixels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-light-300 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isForSale"
                checked={formData.isForSale}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-300 text-primary focus:ring-primary"
              />
              <span className="text-light-300">Available for sale</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isSold"
                checked={formData.isSold}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-300 text-primary focus:ring-primary"
              />
              <span className="text-light-300">Sold</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
            Features */}
        <section className="bg-dark-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-light">Features</h2>
              <p className="text-sm text-dark-400">Highlight key aspects of this artwork</p>
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="btn btn-outline btn-sm gap-1"
            >
              <HiPlus size={16} /> Add Feature
            </button>
          </div>

          {formData.features.length === 0 ? (
            <p className="text-dark-400 text-sm py-4 text-center">
              No features added yet. Click "Add Feature" to highlight key aspects.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 bg-dark-200 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="input"
                        placeholder="Feature title (e.g., Hand-painted details)"
                        maxLength={100}
                      />
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="input resize-none"
                        rows={2}
                        placeholder="Brief description (optional)"
                        maxLength={500}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/*   <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-dark-300 text-primary focus:ring-primary"
              />
              <span className="text-light-300">Featured artwork</span>
            </label>
          </div>
        </section>

        {/* Tags */}
        <section className="bg-dark-100 rounded-xl p-6">
          <h2 className="text-lg font-medium text-light mb-4">Tags</h2>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input"
            placeholder="portrait, oil painting, contemporary (comma separated)"
          />
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/artworks')}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary gap-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><HiSave /> Save Artwork</>}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ArtworkForm;
