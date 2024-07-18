import { Entry, EntrySkeletonType } from 'contentful'
import Button from '@app/components/button'
import { isButton } from '@utils/isButton'
import { ReactNode } from 'react'

type Props = {
  contentBody: (Entry<EntrySkeletonType, 'WITHOUT_UNRESOLVABLE_LINKS', string> | undefined)[]
}

const Content = ({ contentBody }: Props) => {
  const displayContent: ReactNode[] = []

  contentBody.forEach((section) => {
    if (section) {
      if (isButton(section)) {
        displayContent.push(<Button label={section.fields.label} link={section.fields.link} />)
      }
    }
  })

  return (
    <div className="flex flex-col items-center px-4 md:px-6">
      {displayContent.map((content, index) => (
        <div key={index} className="w-full md:w-1/2">
          {content}
        </div>
      ))}
    </div>
  )
}

export default Content
