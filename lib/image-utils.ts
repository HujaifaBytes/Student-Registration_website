// Image validation utilities

export async function validateImageDimensions(
  file: File,
  expectedWidth: number,
  expectedHeight: number,
  tolerancePercent = 5,
): Promise<{ valid: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Check if dimensions are within tolerance
      const widthTolerance = expectedWidth * (tolerancePercent / 100)
      const heightTolerance = expectedHeight * (tolerancePercent / 100)

      const widthValid = img.width >= expectedWidth - widthTolerance && img.width <= expectedWidth + widthTolerance
      const heightValid =
        img.height >= expectedHeight - heightTolerance && img.height <= expectedHeight + heightTolerance

      resolve({
        valid: widthValid && heightValid,
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      resolve({ valid: false, width: 0, height: 0 })
    }

    img.src = URL.createObjectURL(file)
  })
}
