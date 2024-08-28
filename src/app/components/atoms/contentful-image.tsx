import Image, { ImageProps } from 'next/image'

type Props = ImageProps & {
  src: string
}

const ContentfulImage = ({ alt, src, ...props }: Props) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      {...props}
      // loader={() => `${src}?w=${width}&q=75`}
    />
  )
}

export default ContentfulImage
