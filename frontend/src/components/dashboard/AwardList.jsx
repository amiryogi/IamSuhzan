import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiEyeOff,
  HiStar,
} from "react-icons/hi";
import { awardsAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const AwardList = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const response = await awardsAPI.getAll();
      setAwards(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch awards");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this award?")) return;

    try {
      await awardsAPI.delete(id);
      setAwards(awards.filter((award) => award._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete award");
    }
  };

  const handleToggleActive = async (award) => {
    try {
      const response = await awardsAPI.update(award._id, {
        isActive: !award.isActive,
      });
      setAwards(
        awards.map((a) => (a._id === award._id ? response.data.data : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update award");
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "gold":
        return "🥇 Gold";
      case "silver":
        return "🥈 Silver";
      case "bronze":
        return "🥉 Bronze";
      case "featured":
        return "⭐ Featured";
      default:
        return "🏆 Award";
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error mb-4">{error}</p>
        <button onClick={fetchAwards} className="btn btn-primary">
          Try Again
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
            Awards & Achievements
          </h1>
          <p className="text-dark-400 mt-1">
            Manage your awards and recognitions
          </p>
        </div>
        <Link to="/dashboard/awards/new" className="btn btn-primary gap-2">
          <HiPlus /> Add Award
        </Link>
      </div>

      {/* Awards List */}
      {awards.length === 0 ? (
        <div className="text-center py-12 bg-dark-100 rounded-xl">
          <p className="text-dark-400 mb-4">No awards yet</p>
          <Link to="/dashboard/awards/new" className="btn btn-primary gap-2">
            <HiPlus /> Add Your First Award
          </Link>
        </div>
      ) : (
        <div className="bg-dark-100 rounded-xl overflow-hidden">
          <div className="divide-y divide-dark-300">
            {awards.map((award) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-4 hover:bg-dark-200 transition-colors"
              >
                {/* Thumbnail or Icon */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dark-300 flex items-center justify-center">
                  {award.imageUrl ? (
                    <img
                      src={award.imageUrl}
                      alt={award.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HiStar className="text-primary text-2xl" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-light truncate">
                    {award.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-dark-400 mt-1">
                    <span>{award.year}</span>
                    {award.award && (
                      <>
                        <span>•</span>
                        <span>{award.award}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Type Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-dark-300 text-light-300">
                  {getTypeLabel(award.type)}
                </span>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    award.isActive
                      ? "bg-success/20 text-success"
                      : "bg-dark-300 text-dark-400"
                  }`}
                >
                  {award.isActive ? "Active" : "Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(award)}
                    className={`p-2 rounded-lg transition-colors ${
                      award.isActive
                        ? "text-success hover:bg-success/10"
                        : "text-dark-400 hover:bg-dark-300"
                    }`}
                    title={award.isActive ? "Deactivate" : "Activate"}
                  >
                    {award.isActive ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                  <Link
                    to={`/dashboard/awards/${award._id}/edit`}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(award._id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardList;
