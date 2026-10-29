import { captureScale } from "./shared.ts";
import type { CaptureGeometry, ToolRect } from "./shared";

/** Store tiles at the final output scale, rather than keeping hundreds of
 * full-resolution viewport images for a very long page. */
export async function scaleCaptureTile(image: Blob, geometry: CaptureGeometry, rect?: ToolRect): Promise<Blob> {
  const bitmap = await createImageBitmap(image);
  try {
    const ratio = bitmap.width / geometry.viewportWidth;
    const region = rect ?? geometry;
    const scale = captureScale(region.width, region.height, ratio);
    if (scale >= ratio) return image;
    const canvas = new OffscreenCanvas(Math.max(1, Math.round(geometry.viewportWidth * scale)), Math.max(1, Math.round(geometry.viewportHeight * scale)));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Screenshot tidak dapat diproses di browser ini.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await canvas.convertToBlob({ type: "image/png" });
  } finally { bitmap.close(); }
}
