import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiSave, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { heroSlidesAPI, uploadAPI } from "../../services/api";
import MediaUploader from "./MediaUploader";
import LoadingSpinner from "../common/LoadingSpinner";

const HeroSlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    imagePublicId: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchSlide();
    }
  }, [id]);

  const fetchSlide = async () => {
    try {
      const response = await heroSlidesAPI.getById(id);
      const slide = response.data.data;
      setFormData({
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        imageUrl: slide.imageUrl || "",
        imagePublicId: slide.imagePublicId || "",
        isActive: slide.isActive ?? true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch slide");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (media) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: media.url,
      imagePublicId: media.publicId,
    }));
  };

  const handleRemoveImage = async () => {
    if (formData.imagePublicId) {
      try {
        await uploadAPI.deleteFile(formData.imagePublicId);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
      imagePublicId: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.imageUrl) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await heroSlidesAPI.update(id, formData);
        toast.success("Hero slide updated successfully");
      } else {
        await heroSlidesAPI.create(formData);
        toast.success("Hero slide created successfully");
      }
      navigate("/dashboard/hero-slides");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to save slide";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/hero-slides")}
          className="p-2 text-light-300 hover:text-light hover:bg-dark-200 
                   rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            {isEditMode ? "Edit Hero Slide" : "Add Hero Slide"}
          </h1>
          <p className="text-dark-400 text-sm">
            {isEditMode ? "Update slide details" : "Create a new hero slide"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-dark-100 rounded-xl p-6">
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light mb-2">
            Slide Image <span className="text-error">*</span>
          </label>
          {formData.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Slide preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-error text-white rounded-lg 
                         hover:bg-error/80 transition-colors"
              >
                <HiTrash size={18} />
              </button>
            </div>
          ) : (
            <MediaUploader
              onUploadComplete={handleImageUpload}
              acceptedTypes={["image"]}
            />
          )}
          <p className="text-xs text-dark-400 mt-2">
            Recommended: 1920x1080px or higher, landscape orientation
          </p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-light mb-2"
          >
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                     text-light placeholder-dark-400 focus:outline-none focus:border-primary 
                     transition-colors"
            placeholder="Enter slide title"
            maxLength={200}
          />
        </div>

        {/* Subtitle */}
        <div className="mb-6">
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-light mb-2"
          >
            Subtitle (Optional)
          </label>
          <textarea
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                     text-light placeholder-dark-400 focus:outline-none focus:border-primary 
                     transition-colors resize-none"
            placeholder="Enter slide subtitle or description"
            maxLength={500}
          />
        </div>

        {/* Active Status */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dark-300 bg-dark-200 text-primary 
                       focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-light">Active (visible on homepage)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/hero-slides")}
            className="btn btn-outline flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <HiSave /> {isEditMode ? "Update Slide" : "Create Slide"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroSlideForm;
