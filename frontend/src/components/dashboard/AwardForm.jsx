import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiSave, HiTrash } from "react-icons/hi";
import { awardsAPI, uploadAPI } from "../../services/api";
import MediaUploader from "./MediaUploader";
import LoadingSpinner from "../common/LoadingSpinner";

const AwardForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    award: "",
    type: "other",
    imageUrl: "",
    imagePublicId: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  const awardTypes = [
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "bronze", label: "Bronze" },
    { value: "featured", label: "Featured" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchAward();
    }
  }, [id]);

  const fetchAward = async () => {
    try {
      const response = await awardsAPI.getById(id);
      const award = response.data.data;
      setFormData({
        title: award.title || "",
        description: award.description || "",
        year: award.year || new Date().getFullYear(),
        award: award.award || "",
        type: award.type || "other",
        imageUrl: award.imageUrl || "",
        imagePublicId: award.imagePublicId || "",
        isActive: award.isActive ?? true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch award");
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

    if (!formData.year) {
      setError("Year is required");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await awardsAPI.update(id, formData);
      } else {
        await awardsAPI.create(formData);
      }
      navigate("/dashboard/awards");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save award");
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
          onClick={() => navigate("/dashboard/awards")}
          className="p-2 text-light-300 hover:text-light hover:bg-dark-200 
                   rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-light">
            {isEditMode ? "Edit Award" : "Add Award"}
          </h1>
          <p className="text-dark-400 text-sm">
            {isEditMode ? "Update award details" : "Create a new award entry"}
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
            placeholder="e.g., National Portrait Competition"
            maxLength={200}
          />
        </div>

        {/* Award Name & Year Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="award"
              className="block text-sm font-medium text-light mb-2"
            >
              Award Name
            </label>
            <input
              type="text"
              id="award"
              name="award"
              value={formData.award}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                       text-light placeholder-dark-400 focus:outline-none focus:border-primary 
                       transition-colors"
              placeholder="e.g., First Place, Gold Medal"
              maxLength={100}
            />
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-light mb-2"
            >
              Year <span className="text-error">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min={1900}
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                       text-light placeholder-dark-400 focus:outline-none focus:border-primary 
                       transition-colors"
            />
          </div>
        </div>

        {/* Type */}
        <div className="mb-6">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-light mb-2"
          >
            Award Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                     text-light focus:outline-none focus:border-primary transition-colors"
          >
            {awardTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-light mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-xl 
                     text-light placeholder-dark-400 focus:outline-none focus:border-primary 
                     transition-colors resize-none"
            placeholder="Describe this achievement..."
            maxLength={1000}
          />
        </div>

        {/* Image Upload (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light mb-2">
            Image (Optional)
          </label>
          {formData.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden max-w-xs">
              <img
                src={formData.imageUrl}
                alt="Award"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-error text-white rounded-lg 
                         hover:bg-error/80 transition-colors"
              >
                <HiTrash size={16} />
              </button>
            </div>
          ) : (
            <MediaUploader
              onUploadComplete={handleImageUpload}
              acceptedTypes={["image"]}
            />
          )}
          <p className="text-xs text-dark-400 mt-2">
            Optional: Add a certificate or award image
          </p>
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
            <span className="text-light">Active (visible on portfolio)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/awards")}
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
                <HiSave /> {isEditMode ? "Update Award" : "Create Award"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AwardForm;
