import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { categoriesAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoriesAPI.getAll();
            setCategories(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesAPI.delete(id);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-display font-semibold text-light">Categories</h1>
                    <p className="text-dark-400 text-sm">Manage artwork categories</p>
                </div>
                <Link to="/dashboard/categories/new" className="btn btn-primary gap-2">
                    <HiPlus /> Add Category
                </Link>
            </div>

            <div className="bg-dark-100 rounded-xl overflow-hidden border border-dark-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-200 text-light-300 border-b border-dark-300">
                                <th className="px-6 py-4 font-medium">Cover</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium">Artworks</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-300">
                            {categories.map((category) => (
                                <tr key={category._id} className="hover:bg-dark-200/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-dark-300 overflow-hidden">
                                            {category.coverImage?.url ? (
                                                <img
                                                    src={category.coverImage.url}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-dark-400">
                                                    <HiPhotograph size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-light font-medium">{category.name}</div>
                                        <div className="text-xs text-dark-400 truncate max-w-xs">{category.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-dark-400 text-sm">{category.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-dark-300 text-light-300 text-xs font-medium">
                                            {category.artworkCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/dashboard/categories/${category._id}/edit`}
                                                className="p-2 rounded-lg bg-dark-200 text-light-300 hover:text-primary transition-colors"
                                            >
                                                <HiPencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2 rounded-lg bg-dark-200 text-light-300 hover:text-error transition-colors"
                                            >
                                                <HiTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-dark-400">
                                        No categories found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
