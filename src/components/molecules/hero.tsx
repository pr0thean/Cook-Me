import Image from 'next/image'

type Props = {
  heading: string
  imageUrl?: string
}

export const Hero = ({ heading, imageUrl }: Props) => {
  return (
    <div className="bg-gray relative h-60 w-full md:h-96">
      {imageUrl && (
        <Image
          alt={heading}
          src={imageUrl}
          className="h-full w-full object-cover opacity-50"
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
      )}

      <h1 className="hero-text-shadow font-hero text-off-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-2 pb-1 text-center text-2xl font-semibold whitespace-nowrap italic backdrop-blur-xs md:text-5xl">
        {heading}
      </h1>
    </div>
  )
}
