import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import ArtworkList from '../components/dashboard/ArtworkList';
import ArtworkForm from '../components/dashboard/ArtworkForm';
import MediaUploader from '../components/dashboard/MediaUploader';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StatsOverview />} />
        <Route path="artworks" element={<ArtworkList />} />
        <Route path="artworks/new" element={<ArtworkForm />} />
        <Route path="artworks/:id/edit" element={<ArtworkForm />} />
        <Route path="upload" element={
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-display font-semibold text-light mb-6">
              Upload Media
            </h1>
            <div className="bg-dark-100 rounded-xl p-6">
              <MediaUploader onUploadComplete={(media) => console.log('Uploaded:', media)} />
            </div>
          </div>
        } />
        <Route path="categories" element={
          <div className="text-center py-12">
            <h1 className="text-2xl font-display font-semibold text-light mb-4">
              Category Management
            </h1>
            <p className="text-dark-400">Coming soon...</p>
          </div>
        } />
        <Route path="settings" element={
          <div className="text-center py-12">
            <h1 className="text-2xl font-display font-semibold text-light mb-4">
              Settings
            </h1>
            <p className="text-dark-400">Coming soon...</p>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
