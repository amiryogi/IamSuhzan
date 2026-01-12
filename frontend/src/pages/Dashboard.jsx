import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsOverview from "../components/dashboard/StatsOverview";
import ArtworkList from "../components/dashboard/ArtworkList";
import ArtworkForm from "../components/dashboard/ArtworkForm";
import HeroSlideList from "../components/dashboard/HeroSlideList";
import HeroSlideForm from "../components/dashboard/HeroSlideForm";
import AwardList from "../components/dashboard/AwardList";
import AwardForm from "../components/dashboard/AwardForm";
import CategoryList from "../components/dashboard/CategoryList";
import CategoryForm from "../components/dashboard/CategoryForm";
import PhotographyList from "../components/dashboard/PhotographyList";
import PhotographyForm from "../components/dashboard/PhotographyForm";
import MediaUploader from "../components/dashboard/MediaUploader";
import ProfileSettings from "../components/dashboard/ProfileSettings";
import MessageInbox from "../components/dashboard/MessageInbox";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

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
        <Route path="hero-slides" element={<HeroSlideList />} />
        <Route path="hero-slides/new" element={<HeroSlideForm />} />
        <Route path="hero-slides/:id/edit" element={<HeroSlideForm />} />
        <Route path="awards" element={<AwardList />} />
        <Route path="awards/new" element={<AwardForm />} />
        <Route path="awards/:id/edit" element={<AwardForm />} />
        <Route
          path="upload"
          element={
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-display font-semibold text-light mb-6">
                Upload Media
              </h1>
              <div className="bg-dark-100 rounded-xl p-6">
                <MediaUploader
                  onUploadComplete={(media) => console.log("Uploaded:", media)}
                />
              </div>
            </div>
          }
        />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="photography" element={<PhotographyList />} />
        <Route path="photography/new" element={<PhotographyForm />} />
        <Route path="photography/:id/edit" element={<PhotographyForm />} />
        <Route path="messages" element={<MessageInbox />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
