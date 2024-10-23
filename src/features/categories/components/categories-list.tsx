import ContentfulImage from '@components/atoms/contentful-image'
import { getCategories } from '@features/categories/operations/get-categories'
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
          className="group block aspect-square rounded-md bg-gray text-white"
        >
          {category.image && (
            <div
              className="relative overflow-hidden rounded-t-md"
              style={{ height: 'calc(100% - 28px)' }}
            >
              <ContentfulImage
                alt={category.image.title}
                src={category.image.url}
                className="transition-all duration-300 group-hover:scale-110"
              />
            </div>
          )}

          <p className="p-[2px] text-center">{category.title}</p>
        </Link>
      ))}
    </div>
  )
}

export default CategoriesList
