import { getCategories } from '@app/actions/getCategories'
import ContentfulImage from '@components/atoms/contentful-image'
import Link from 'next/link'

const CategoriesList = async () => {
  const categories = await getCategories()

  return (
    <div
      id="tour-categories"
      className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6"
    >
      {categories.map((category, index) => (
        <Link
          href={`category/${category.slug}`}
          key={index}
          className="group bg-gray block aspect-square rounded-md text-white"
        >
          {category.imageUrl && (
            <div
              className="relative overflow-hidden rounded-t-md"
              style={{ height: 'calc(100% - 28px)' }}
            >
              <ContentfulImage
                alt={category.name}
                src={category.imageUrl}
                className="transition-all duration-300 group-hover:scale-110"
              />
            </div>
          )}

          <p className="p-0.5 text-center">{category.name}</p>
        </Link>
      ))}
    </div>
  )
}

export default CategoriesList
