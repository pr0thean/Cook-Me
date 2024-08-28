import ContentfulImage from '@app/components/atoms/contentful-image'
import { AssetType } from '@typings/models/asset.model'

type Props = {
  image?: AssetType
  heading: string
}

const Hero = ({ image, heading }: Props) => {
  return (
    <div className="relative h-60 w-full bg-gray md:h-96">
      {image && (
        <ContentfulImage alt={image.title} src={image.url} className="opacity-50" priority />
      )}

      <h1 className="hero-text-shadow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap px-2 pb-1 text-center font-hero text-2xl font-semibold text-off-black backdrop-blur-sm md:text-4xl">
        {heading}
      </h1>
    </div>
  )
}

export default Hero
