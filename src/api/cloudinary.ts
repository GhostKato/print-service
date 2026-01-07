export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are not set correctly.')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Помилка завантаження в Cloudinary')
    }
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    throw error
  }
}

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  try {
    if (!imageUrl) return

    const parts = imageUrl.split('/')
    const fileNameWithExtension = parts.pop()
    if (!fileNameWithExtension) {
      console.error('Не вдалося отримати ім’я файлу з URL')
      return
    }
    const publicId = fileNameWithExtension.split('.')[0]
    if (!publicId) return
    console.log(`Запит на видалення з Cloudinary. Public ID: ${publicId}`)
  } catch (error) {
    console.error('Помилка при обробці видалення:', error)
  }
}
