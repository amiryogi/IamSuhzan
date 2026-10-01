import { useState } from 'react';
import { HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordSettings = () => {
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setSaving(true);
        try {
            const res = await authAPI.updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            // The API returns a fresh token for the updated account
            localStorage.setItem('token', res.data.token);
            setFormData(emptyForm);
            toast.success('Password updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-dark-100 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-medium text-light mb-4 flex items-center gap-2">
                <HiLockClosed className="text-primary" /> Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm text-light-300 mb-2">Current Password</label>
                    <input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                        className="input"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm text-light-300 mb-2">New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="input"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm text-light-300 mb-2">Confirm New Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="input"
                    />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-outline gap-2 disabled:opacity-50"
                >
                    {saving ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
    );
};

export default PasswordSettings;
