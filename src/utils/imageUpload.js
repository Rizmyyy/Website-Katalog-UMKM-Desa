/**
 * Utility for uploading images to ImgBB
 */

export const uploadToImgBB = async (base64Data, filename = 'image') => {
  try {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_IMGBB_API_KEY is not defined in .env');
    }

    // Extract the base64 string without the data URL prefix
    const base64String = base64Data.split(',')[1] || base64Data;

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64String);
    if (filename) {
      formData.append('name', filename);
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      // Returns the direct URL to the image
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    throw error;
  }
};
