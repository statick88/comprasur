const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'comprasur_avatars';

export async function uploadImageToCloudinary(uri: string): Promise<{ secure_url: string }> {
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary no configurado. Agrega EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME al .env');
  }
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: 'avatar.jpg' } as any);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error al subir imagen a Cloudinary');
  return res.json();
}
