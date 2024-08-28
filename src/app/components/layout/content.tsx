import { Button } from '@app/components/atoms/button'
import { SectionType } from '@typings/models/section.model'
import { isButton } from '@utils/isButton'
import { ReactNode } from 'react'

type Props = {
  contentBody: SectionType[]
}

const Content = ({ contentBody }: Props) => {
  const displayContent: ReactNode[] = []

  contentBody.forEach((section) => {
    if (section) {
      if (isButton(section)) {
        displayContent.push(<Button label={section.label} link={section.link} />)
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
