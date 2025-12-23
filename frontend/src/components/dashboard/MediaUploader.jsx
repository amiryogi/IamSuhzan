import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCloudUpload, HiX, HiPhotograph, HiVideoCamera, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { uploadAPI } from '../../services/api';

const MediaUploader = ({ onUploadComplete, multiple = true, accept = 'all' }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const acceptConfig = {
    all: { 'image/*': [], 'video/*': [] },
    images: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    videos: { 'video/*': ['.mp4', '.mov', '.avi', '.webm'] },
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }));
    setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig[accept],
    multiple,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedMedia = [];

    try {
      for (const item of files) {
        setUploadProgress((prev) => ({ ...prev, [item.id]: 0 }));

        const response = item.type === 'video'
          ? await uploadAPI.uploadVideo(item.file)
          : await uploadAPI.uploadImage(item.file);

        uploadedMedia.push(response.data.data);
        setUploadProgress((prev) => ({ ...prev, [item.id]: 100 }));
      }

      toast.success(`${uploadedMedia.length} file(s) uploaded successfully!`);
      onUploadComplete?.(uploadedMedia);
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                   transition-colors ${
                     isDragActive
                       ? 'border-primary bg-primary/5'
                       : 'border-dark-300 hover:border-primary/50'
                   }`}
      >
        <input {...getInputProps()} />
        <HiCloudUpload className="text-5xl text-dark-400 mx-auto mb-4" />
        <p className="text-light mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-dark-400">
          or click to browse • Images up to 10MB, Videos up to 100MB
        </p>
      </div>

      {/* File Preview Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-dark-200"
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.preview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-dark/80 rounded 
                               text-xs text-light flex items-center gap-1">
                    {item.type === 'video' ? <HiVideoCamera /> : <HiPhotograph />}
                    {item.type}
                  </div>

                  {/* Progress Overlay */}
                  {uploadProgress[item.id] !== undefined && (
                    <div className="absolute inset-0 bg-dark/80 flex items-center justify-center">
                      {uploadProgress[item.id] === 100 ? (
                        <HiCheck className="text-4xl text-success" />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-4 border-dark-300 
                                     border-t-primary animate-spin" />
                      )}
                    </div>
                  )}

                  {/* Remove Button */}
                  {!uploading && (
                    <button
                      onClick={() => removeFile(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark/80 
                               flex items-center justify-center text-light 
                               hover:bg-error transition-colors"
                    >
                      <HiX />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Upload Button */}
            <motion.button
              onClick={uploadFiles}
              disabled={uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent 
                               rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <HiCloudUpload />
                  Upload {files.length} File{files.length > 1 ? 's' : ''}
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUploader;
