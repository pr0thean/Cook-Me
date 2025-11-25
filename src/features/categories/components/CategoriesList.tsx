import { getCategories } from '@/app/actions/getCategories'
import Image from 'next/image'
import Link from 'next/link'

export const CategoriesList = async () => {
  const categories = await getCategories()

  return (
    <>
      <h2 className="text-2xl font-bold text-white">Categories</h2>

      <div
        id="tour-categories"
        className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6"
      >
        {categories.map((category, index) => (
          <Link
            href={`category/${category.slug}`}
            key={index}
            className="group bg-blue-gray shadow-off-black/30 block aspect-square rounded-md text-white shadow-md"
          >
            {category.imageUrl && (
              <div
                className="relative overflow-hidden rounded-t-md"
                style={{ height: 'calc(100% - 28px)' }}
              >
                <Image
                  alt={category.name}
                  src={category.imageUrl}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                  fill
                  sizes="200px"
                />
              </div>
            )}

            <p className="p-0.5 text-center">{category.name}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
