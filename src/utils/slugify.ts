import slugifyLib from 'slugify'

export const slugify = (text: string) => {
  return slugifyLib(text, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
    locale: 'pl', // Polish locale for proper transliteration
    trim: true, // Trim whitespace
  })
}
