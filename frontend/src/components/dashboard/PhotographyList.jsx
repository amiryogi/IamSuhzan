import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";
import { photographyAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const PhotographyList = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await photographyAPI.getAll();
      setPhotos(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch photography");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await photographyAPI.delete(id);
      setPhotos(photos.filter((photo) => photo._id !== id));
      toast.success("Photo deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete photo");
    }
  };

  const handleToggleActive = async (photo) => {
    try {
      const response = await photographyAPI.update(photo._id, {
        isActive: !photo.isActive,
      });
      setPhotos(
        photos.map((p) => (p._id === photo._id ? response.data.data : p))
      );
      toast.success(
        `Photo ${response.data.data.isActive ? "activated" : "deactivated"}`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update photo");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">{error}</p>
        <button onClick={fetchPhotos} className="btn btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            Photography
          </h1>
          <p className="text-dark-400 text-sm">
            {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/dashboard/photography/new" className="btn btn-primary gap-2">
          <HiPlus size={20} />
          Add Photo
        </Link>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 bg-dark-100 rounded-xl">
          <p className="text-dark-400 mb-4">No photography works yet</p>
          <Link to="/dashboard/photography/new" className="btn btn-primary">
            Add Your First Photo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-dark-100 rounded-xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {!photo.isActive && (
                  <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
                    <span className="text-light-300 text-sm font-medium">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-light font-medium truncate">
                  {photo.title}
                </h3>
                {photo.category && (
                  <span className="text-primary text-sm">{photo.category}</span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-300">
                  <button
                    onClick={() => handleToggleActive(photo)}
                    className={`p-2 rounded-lg transition-colors ${
                      photo.isActive
                        ? "text-success hover:bg-success/10"
                        : "text-dark-400 hover:bg-dark-200"
                    }`}
                    title={photo.isActive ? "Hide" : "Show"}
                  >
                    {photo.isActive ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                  <Link
                    to={`/dashboard/photography/${photo._id}/edit`}
                    className="p-2 text-light-300 hover:text-primary hover:bg-dark-200 
                             rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(photo._id)}
                    className="p-2 text-light-300 hover:text-error hover:bg-error/10 
                             rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotographyList;
