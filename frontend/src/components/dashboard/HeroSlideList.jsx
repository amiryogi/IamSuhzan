import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiEyeOff,
  HiMenuAlt4,
} from "react-icons/hi";
import { heroSlidesAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const HeroSlideList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await heroSlidesAPI.getAll();
      setSlides(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      await heroSlidesAPI.delete(id);
      setSlides(slides.filter((slide) => slide._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete slide");
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const response = await heroSlidesAPI.update(slide._id, {
        isActive: !slide.isActive,
      });
      setSlides(
        slides.map((s) => (s._id === slide._id ? response.data.data : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update slide");
    }
  };

  const handleReorder = async (newOrder) => {
    setSlides(newOrder);

    // Debounce the API call
    if (reordering) return;
    setReordering(true);

    try {
      const slidesWithOrder = newOrder.map((slide, index) => ({
        id: slide._id,
        order: index,
      }));
      await heroSlidesAPI.reorder(slidesWithOrder);
    } catch (err) {
      console.error("Failed to reorder:", err);
      fetchSlides(); // Revert to server state on error
    } finally {
      setReordering(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error mb-4">{error}</p>
        <button onClick={fetchSlides} className="btn btn-primary">
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
            Hero Slides
          </h1>
          <p className="text-dark-400 mt-1">
            Manage your homepage hero slider images
          </p>
        </div>
        <Link to="/dashboard/hero-slides/new" className="btn btn-primary gap-2">
          <HiPlus /> Add Slide
        </Link>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="text-center py-12 bg-dark-100 rounded-xl">
          <p className="text-dark-400 mb-4">No hero slides yet</p>
          <Link
            to="/dashboard/hero-slides/new"
            className="btn btn-primary gap-2"
          >
            <HiPlus /> Add Your First Slide
          </Link>
        </div>
      ) : (
        <div className="bg-dark-100 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-dark-300 text-sm text-dark-400">
            <span className="flex items-center gap-2">
              <HiMenuAlt4 /> Drag to reorder slides
            </span>
          </div>
          <Reorder.Group
            axis="y"
            values={slides}
            onReorder={handleReorder}
            className="divide-y divide-dark-300"
          >
            {slides.map((slide) => (
              <Reorder.Item
                key={slide._id}
                value={slide}
                className="flex items-center gap-4 p-4 bg-dark-100 hover:bg-dark-200 
                          cursor-grab active:cursor-grabbing transition-colors"
              >
                {/* Drag Handle */}
                <div className="text-dark-400 hover:text-light">
                  <HiMenuAlt4 size={20} />
                </div>

                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-light truncate">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-sm text-dark-400 truncate">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    slide.isActive
                      ? "bg-success/20 text-success"
                      : "bg-dark-300 text-dark-400"
                  }`}
                >
                  {slide.isActive ? "Active" : "Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.isActive
                        ? "text-success hover:bg-success/10"
                        : "text-dark-400 hover:bg-dark-300"
                    }`}
                    title={slide.isActive ? "Deactivate" : "Activate"}
                  >
                    {slide.isActive ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                  <Link
                    to={`/dashboard/hero-slides/${slide._id}/edit`}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <HiPencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};

export default HeroSlideList;
