import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiSave, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { photographyAPI, uploadAPI } from "../../services/api";
import MediaUploader from "./MediaUploader";
import LoadingSpinner from "../common/LoadingSpinner";

const PhotographyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imagePublicId: "",
    category: "",
    dateTaken: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchPhoto();
    }
  }, [id]);

  const fetchPhoto = async () => {
    try {
      const response = await photographyAPI.getById(id);
      const photo = response.data.data;
      setFormData({
        title: photo.title || "",
        description: photo.description || "",
        imageUrl: photo.imageUrl || "",
        imagePublicId: photo.imagePublicId || "",
        category: photo.category || "",
        dateTaken: photo.dateTaken
          ? new Date(photo.dateTaken).toISOString().split("T")[0]
          : "",
        isActive: photo.isActive ?? true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch photo");
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

  const handleImageUpload = (mediaArray) => {
    // MediaUploader returns an array, we take the first item
    if (mediaArray && mediaArray.length > 0) {
      const media = mediaArray[0];
      setFormData((prev) => ({
        ...prev,
        imageUrl: media.url,
        imagePublicId: media.publicId,
      }));
    }
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
      const payload = {
        ...formData,
        dateTaken: formData.dateTaken
          ? new Date(formData.dateTaken)
          : undefined,
      };

      if (isEditMode) {
        await photographyAPI.update(id, payload);
        toast.success("Photo updated successfully");
      } else {
        await photographyAPI.create(payload);
        toast.success("Photo created successfully");
      }
      navigate("/dashboard/photography");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to save photo";
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
          onClick={() => navigate("/dashboard/photography")}
          className="p-2 text-light-300 hover:text-light hover:bg-dark-200 
                   rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            {isEditMode ? "Edit Photo" : "Add Photo"}
          </h1>
          <p className="text-dark-400 text-sm">
            {isEditMode ? "Update photo details" : "Add a new photography work"}
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
            Photo <span className="text-error">*</span>
          </label>
          {formData.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={formData.imageUrl}
                alt="Photo preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-error text-light rounded-lg 
                         hover:bg-error/80 transition-colors"
              >
                <HiTrash size={20} />
              </button>
            </div>
          ) : (
            <MediaUploader
              onUploadComplete={handleImageUpload}
              multiple={false}
              accept="images"
            />
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light mb-2">
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter photo title"
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input resize-none"
            rows={3}
            placeholder="Brief description of the photo (optional)"
            maxLength={1000}
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Landscape, Portrait, Street"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light mb-2">
              Date Taken
            </label>
            <input
              type="date"
              name="dateTaken"
              value={formData.dateTaken}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-dark-300 text-primary focus:ring-primary"
            />
            <span className="text-light-300">Active (visible on website)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/photography")}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <HiSave size={20} />
                {isEditMode ? "Update Photo" : "Create Photo"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhotographyForm;
