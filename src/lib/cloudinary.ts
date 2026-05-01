// src/lib/cloudinary.ts
import { fetch } from 'expo/fetch';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

// Upload image to Cloudinary
export async function uploadImageToCloudinary(fileUri: string): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME) {
    throw new Error('Missing EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    
    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}
