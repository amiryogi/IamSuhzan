import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiSave, HiPhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { categoriesAPI } from '../../services/api';
import MediaUploader from './MediaUploader';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: 0,
        coverImage: { url: '', publicId: '' },
    });

    useEffect(() => {
        if (isEdit) fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        try {
            const res = await categoriesAPI.getById(id);
            setFormData(res.data.data);
        } catch (error) {
            toast.error('Failed to load category');
            navigate('/dashboard/categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'order' ? Number(value) : value,
        }));
    };

    const handleMediaUpload = (uploadedMedia) => {
        if (uploadedMedia.length > 0) {
            setFormData((prev) => ({
                ...prev,
                coverImage: {
                    url: uploadedMedia[0].url,
                    publicId: uploadedMedia[0].publicId,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isEdit) {
                await categoriesAPI.update(id, formData);
                toast.success('Category updated successfully');
            } else {
                await categoriesAPI.create(formData);
                toast.success('Category created successfully');
            }
            navigate('/dashboard/categories');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/dashboard/categories')}
                    className="p-2 rounded-lg bg-dark-200 text-light-300 hover:bg-dark-300 transition-colors"
                >
                    <HiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-display font-semibold text-light">
                        {isEdit ? 'Edit Category' : 'Add New Category'}
                    </h1>
                    <p className="text-dark-400 text-sm">
                        {isEdit ? 'Update category details' : 'Create a new artwork category'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cover Image */}
                <section className="bg-dark-100 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-light mb-4">Cover Image</h2>

                    {formData.coverImage?.url && (
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-dark-200">
                            <img
                                src={formData.coverImage.url}
                                alt="Category Cover"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <MediaUploader onUploadComplete={handleMediaUpload} />
                    <p className="text-xs text-dark-400 mt-2">Recommended: 16:9 aspect ratio</p>
                </section>

                {/* Basic Info */}
                <section className="bg-dark-100 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-light mb-4">Category Details</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-light-300 mb-2">Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input"
                                placeholder="e.g. Portrait, Abstract"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-light-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="input resize-none"
                                placeholder="Brief description of the category..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-light-300 mb-2">Display Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="input"
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/categories')}
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
                        {saving ? 'Saving...' : <><HiSave /> Save Category</>}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
