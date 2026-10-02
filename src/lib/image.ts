const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.9;

/**
 * Convierte cualquier imagen (incluidas HEIC/PNG de galería) en un JPEG
 * ligero y compatible con cualquier navegador. Si el navegador no puede
 * decodificar el archivo, se devuelve el original sin cambios.
 */
export async function normalizeImageFile(file: File): Promise<File> {
  if (file.type === "image/jpeg" && file.size < 3_500_000) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch (_e) {
    return file;
  }
}