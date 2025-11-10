import ContentfulImage from '@components/atoms/contentful-image'

type Props = {
  heading: string
  imageUrl?: string
}

const Hero = ({ heading, imageUrl }: Props) => {
  return (
    <div className="bg-gray relative h-60 w-full md:h-96">
      {imageUrl && <ContentfulImage alt={heading} src={imageUrl} className="opacity-50" priority />}

      <h1 className="hero-text-shadow font-hero text-off-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-2 pb-1 text-center text-2xl font-semibold whitespace-nowrap italic backdrop-blur-xs md:text-5xl">
        {heading}
      </h1>
    </div>
  )
}

export default Hero
