import ContentfulImage from '@app/components/contentful-image'
import { getCategories } from '@services/getCategories'
import Link from 'next/link'

const CategoriesList = async () => {
  const categories = await getCategories()

  return (
    <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-6 md:px-6">
      {categories.map((category, index) => (
        <Link
          href={`category/${category.slug}`}
          key={index}
          className="block aspect-square rounded-md bg-gray text-white"
        >
          {category.image && (
            <ContentfulImage
              alt={category.image.fields.title || ''}
              src={category.image.fields.file?.url || ''}
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
