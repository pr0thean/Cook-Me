import ContentfulImage from '@app/components/atoms/contentful-image'
import { getCategories } from '@services/getCategories'
import Link from 'next/link'

const CategoriesList = async () => {
  const categories = await getCategories()

  if (categories.isErr() || !categories.value) {
    return <div>Failed to load categories</div>
  }

  return (
    <div
      id="tour-categories"
      className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6"
    >
      {categories.value.map((category, index) => (
        <Link
          href={`category/${category.slug}`}
          key={index}
          className="block aspect-square rounded-md bg-gray text-white"
        >
          {category.image && (
            <ContentfulImage
              alt={category.image.title}
              src={category.image.url}
              className="rounded-t-md"
            />
          )}

          <p className="p-[2px] text-center">{category.title}</p>
        </Link>
      ))}
    </div>
  )
}

export default CategoriesList
