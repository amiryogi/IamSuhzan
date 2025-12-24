import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSave, HiUser, HiGlobeAlt, HiPhotograph } from 'react-icons/hi';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import MediaUploader from './MediaUploader';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        artistStatement: '',
        avatar: '',
        socialLinks: {
            instagram: '',
            facebook: '',
            twitter: '',
            website: '',
            youtube: '',
        },
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authAPI.getMe();
            const user = res.data.data;
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                artistStatement: user.artistStatement || '',
                avatar: user.avatar || '',
                socialLinks: user.socialLinks || {
                    instagram: '',
                    facebook: '',
                    twitter: '',
                    website: '',
                    youtube: '',
                },
            });
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarUpload = (media) => {
        if (media.length > 0) {
            setFormData((prev) => ({ ...prev, avatar: media[0].url }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authAPI.updateProfile(formData);
            toast.success('Profile updated successfully');
            // Update local storage user if needed
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-display font-semibold text-light">Profile Settings</h1>
                <p className="text-dark-400 text-sm">Manage your artist profile and social links</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <section className="bg-dark-100 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-light mb-4 flex items-center gap-2">
                        <HiPhotograph className="text-primary" /> Profile Photo
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-full bg-dark-200 overflow-hidden border-2 border-dark-300">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-dark-400">
                                    <HiUser size={48} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <MediaUploader onUploadComplete={handleAvatarUpload} />
                            <p className="text-xs text-dark-400 mt-2">Recommended: Square image, 400x400px</p>
                        </div>
                    </div>
                </section>

                {/* Basic Info */}
                <section className="bg-dark-100 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-light mb-4 flex items-center gap-2">
                        <HiUser className="text-primary" /> Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-light-300 mb-2">Display Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-light-300 mb-2">Email (Read-only)</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="input opacity-50 cursor-not-allowed"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-light-300 mb-2">About (Bio)</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="input resize-none"
                                placeholder="Brief biography..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-light-300 mb-2">Artist Statement</label>
                            <textarea
                                name="artistStatement"
                                value={formData.artistStatement}
                                onChange={handleChange}
                                rows={6}
                                className="input resize-none"
                                placeholder="Describe your artistic vision and process..."
                            />
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="bg-dark-100 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-light mb-4 flex items-center gap-2">
                        <HiGlobeAlt className="text-primary" /> Social Media & Links
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                <FaInstagram />
                            </span>
                            <input
                                type="url"
                                name="socialLinks.instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleChange}
                                placeholder="Instagram URL"
                                className="input pl-10"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                <FaFacebookF />
                            </span>
                            <input
                                type="url"
                                name="socialLinks.facebook"
                                value={formData.socialLinks.facebook}
                                onChange={handleChange}
                                placeholder="Facebook URL"
                                className="input pl-10"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                <FaTwitter />
                            </span>
                            <input
                                type="url"
                                name="socialLinks.twitter"
                                value={formData.socialLinks.twitter}
                                onChange={handleChange}
                                placeholder="Twitter URL"
                                className="input pl-10"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                <FaYoutube />
                            </span>
                            <input
                                type="url"
                                name="socialLinks.youtube"
                                value={formData.socialLinks.youtube}
                                onChange={handleChange}
                                placeholder="YouTube URL"
                                className="input pl-10"
                            />
                        </div>
                        <div className="md:col-span-2 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                <HiGlobeAlt />
                            </span>
                            <input
                                type="url"
                                name="socialLinks.website"
                                value={formData.socialLinks.website}
                                onChange={handleChange}
                                placeholder="Personal Website URL"
                                className="input pl-10"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <motion.button
                        type="submit"
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-primary gap-2 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><HiSave /> Save Changes</>}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
