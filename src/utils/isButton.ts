import { ButtonType } from '@typings/models/button.model'
import { SectionType } from '@typings/models/section.model'

export const isButton = (item: SectionType): item is ButtonType => {
  return item.__typename === 'Button'
}
