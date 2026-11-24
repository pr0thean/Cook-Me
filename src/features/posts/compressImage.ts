import { POST_IMAGE_MAX_BYTES } from './types'

const MAX_SIDE = 1600
const QUALITIES = [0.8, 0.65, 0.5]

export type CompressedImage = {
  file: File
  width: number
  height: number
}

/** The browser can't decode the file (e.g. HEIC outside Safari) */
export class UnsupportedImageError extends Error {}

type Decoded = { source: CanvasImageSource; width: number; height: number; release: () => void }

/** Decodes the file, applying its EXIF orientation */
async function decode(file: File): Promise<Decoded> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    }
  } catch {
    // Fallback: an <img> element (Safari decodes HEIC here but not always via createImageBitmap)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.src = url

    try {
      await image.decode()
    } catch {
      URL.revokeObjectURL(url)
      throw new UnsupportedImageError(`Cannot decode ${file.name}`)
    }

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * Resizes a photo to at most 1600px on the longest side and re-encodes it as WebP (JPEG where the
 * browser can't encode WebP). Drawing it onto a canvas drops all metadata, including EXIF/GPS.
 * Lowers the quality until the file fits the server's size limit.
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  const decoded = await decode(file)

  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(decoded.width, decoded.height))
    const width = Math.max(1, Math.round(decoded.width * scale))
    const height = Math.max(1, Math.round(decoded.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is not supported')

    // JPEG has no transparency: make transparent PNG areas white rather than black
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.drawImage(decoded.source, 0, 0, width, height)

    for (const quality of QUALITIES) {
      let blob = await canvasToBlob(canvas, 'image/webp', quality)

      // Browsers that can't encode WebP silently return PNG instead
      if (blob?.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg', quality)
      if (!blob) throw new Error('Could not encode the image')

      if (blob.size <= POST_IMAGE_MAX_BYTES) {
        const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
        const compressed = new File([blob], `photo.${extension}`, { type: blob.type })

        return { file: compressed, width, height }
      }
    }

    throw new Error('The photo is too large even after compression')
  } finally {
    decoded.release()
  }
}
