/**
 * Utility for uploading images to Cloudinary
 */

export const uploadToCloudinary = async (base64Data, filename = 'image') => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary credentials (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET) are missing in .env');
    }

    // Cloudinary natively supports base64 Data URLs (e.g., data:image/jpeg;base64,...)
    // If somehow it's a raw base64 string, we might need to prepend it, but FileReader already returns Data URLs.
    let finalBase64 = base64Data;
    if (!finalBase64.startsWith('data:image')) {
      finalBase64 = `data:image/jpeg;base64,${base64Data}`;
    }

    const formData = new FormData();
    formData.append('file', finalBase64);
    formData.append('upload_preset', uploadPreset);
    
    // We purposely DO NOT append 'public_id' here.
    // Let Cloudinary generate a unique random ID for every image.
    // This prevents images with the same filename (e.g., '1.jpg', 'image.png') from overwriting each other.

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      // Returns the secure direct URL to the image
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
