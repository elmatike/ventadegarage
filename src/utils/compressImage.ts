import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.6,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Error compressing image:', error)
    return file
  }
}

export async function compressImages(files: File[]): Promise<File[]> {
  const compressedFiles: File[] = []

  for (const file of files) {
    const compressed = await compressImage(file)
    compressedFiles.push(compressed)
  }

  return compressedFiles
}
