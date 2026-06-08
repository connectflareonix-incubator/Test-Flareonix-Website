/* Read a file as base64 data URL. Validates type and size. */
export const MAX_BYTES = 5 * 1024 * 1024;

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file'));
    if (!file.type.startsWith('image/')) return reject(new Error('Only image files allowed'));
    if (file.size > MAX_BYTES) return reject(new Error('Max 5MB'));
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Read failed'));
    r.readAsDataURL(file);
  });
}
