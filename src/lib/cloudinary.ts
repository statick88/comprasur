const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export async function uploadImageToCloudinary(uri: string): Promise<{ secure_url: string }> {
  if (!CLOUD_NAME) {
    throw new Error('Agrega EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME al .env (ver dashboard.cloudinary.com)');
  }
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: 'avatar.jpg' } as any);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Error al subir imagen');
  }
  return res.json();
}
