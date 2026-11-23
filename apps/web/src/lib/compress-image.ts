'use client';

/**
 * Rasmni yuklashdan oldin brauzerda kichraytiradi (maks 1600px).
 * WebP (~80%): JPEG'dan ~30% yengil (3 MB -> ~150 KB). WebP'ni qo'llamaydigan brauzerda JPEG.
 */
export async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  if (file.type === 'image/gif' || !file.type.startsWith('image/')) return file; // GIF animatsiyasi buzilmasin
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 300 * 1024) { bmp.close?.(); return file; } // allaqachon kichik
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // shaffof PNG qora bo'lib qolmasin
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const encode = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
    let blob = await encode('image/webp');
    if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg'); // eski Safari WebP yoza olmaydi
    if (!blob || blob.size >= file.size) return file;
    const ext = blob.type === 'image/webp' ? '.webp' : '.jpg';
    return new File([blob], file.name.replace(/\.\w+$/, '') + ext, { type: blob.type });
  } catch { return file; }
}
