import { apiFetch } from '../api-client';

interface UploadResponse {
  url: string;
}

/**
 * Uploads an image file to the backend (which stores it in Vercel Blob)
 * and resolves with the public URL.
 */
export function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      apiFetch<UploadResponse>('/uploads', {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          base64: reader.result as string,
        }),
      })
        .then((res) => resolve(res.url))
        .catch(reject);
    };

    reader.readAsDataURL(file);
  });
}

export function isDataUrl(url: string): boolean {
  return url.startsWith('data:');
}