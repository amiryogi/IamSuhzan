const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'art-portfolio/artworks',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:best' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Create thumbnail URL
    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: 'image',
        width: result.width,
        height: result.height,
        format: result.format,
        thumbnailUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload video to Cloudinary
// @route   POST /api/upload/video
// @access  Private
exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'art-portfolio/videos',
          resource_type: 'video',
          eager: [
            { width: 400, height: 400, crop: 'fill', format: 'jpg' },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Create thumbnail from video
    const thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: 'video',
      width: 400,
      height: 400,
      crop: 'fill',
      format: 'jpg',
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: 'video',
        width: result.width,
        height: result.height,
        format: result.format,
        duration: result.duration,
        thumbnailUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const { publicId, type = 'image' } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });

    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete file',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload files',
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const isVideo = file.mimetype.startsWith('video/');
        
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: isVideo ? 'art-portfolio/videos' : 'art-portfolio/artworks',
            resource_type: isVideo ? 'video' : 'image',
            transformation: isVideo ? [] : [
              { quality: 'auto:best' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else {
              const thumbnailUrl = isVideo
                ? cloudinary.url(result.public_id, {
                    resource_type: 'video',
                    width: 400,
                    height: 400,
                    crop: 'fill',
                    format: 'jpg',
                  })
                : cloudinary.url(result.public_id, {
                    width: 400,
                    height: 400,
                    crop: 'fill',
                    quality: 'auto',
                  });

              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                type: isVideo ? 'video' : 'image',
                width: result.width,
                height: result.height,
                format: result.format,
                thumbnailUrl,
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};
