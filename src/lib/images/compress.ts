// Client-side image compression. Every photo is resized and re-encoded in the
// browser BEFORE it reaches Supabase Storage, so the free-tier storage + egress
// budget is protected and uploads stay fast on phone connections. Always call
// `compressImage` before `storage.upload`.
import imageCompression from "browser-image-compression";

/** Tuned for a shared trip gallery: good-looking photos that stay small. */
const DEFAULT_OPTIONS = {
  /** Hard cap on the output file size. */
  maxSizeMB: 0.8,
  /** Longest edge, in px — plenty for a gallery grid + lightbox. */
  maxWidthOrHeight: 1920,
  /** Offload the work to a worker so the UI stays responsive. */
  useWebWorker: true,
  /** Prefer WebP when the browser supports it for a smaller payload. */
  fileType: "image/webp" as const,
};

export interface CompressResult {
  file: File;
  originalBytes: number;
  compressedBytes: number;
}

/**
 * Resize and compress an image file. Returns the compressed `File` plus the
 * before/after byte sizes so the UI can show how much was saved. If
 * compression throws for any reason, the original file is returned unchanged so
 * an upload is never silently dropped.
 */
export async function compressImage(
  file: File,
  options: Partial<typeof DEFAULT_OPTIONS> = {},
): Promise<CompressResult> {
  const originalBytes = file.size;
  try {
    const compressed = await imageCompression(file, {
      ...DEFAULT_OPTIONS,
      ...options,
    });
    return {
      file: compressed,
      originalBytes,
      compressedBytes: compressed.size,
    };
  } catch {
    return { file, originalBytes, compressedBytes: originalBytes };
  }
}
