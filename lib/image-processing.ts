import sharp from "sharp"

/**
 * Processes an image to ensure it meets required dimensions and formats
 * @param file The image file to process
 * @param targetWidth Target width for the image
 * @param targetHeight Target height for the image
 * @returns A Buffer containing the processed image data
 */
export async function processImage(
  file: File,
  targetWidth = 600,
  targetHeight = 600,
): Promise<{ buffer: Buffer; contentType: string }> {
  // Convert File to Buffer
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  // Process with sharp
  const processedImageBuffer = await sharp(fileBuffer)
    .resize({
      width: targetWidth,
      height: targetHeight,
      fit: "cover",
      position: "center",
    })
    .toFormat("jpeg")
    .jpeg({ quality: 85 })
    .toBuffer()

  return {
    buffer: processedImageBuffer,
    contentType: "image/jpeg",
  }
}
