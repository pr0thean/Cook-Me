import { ButtonType } from '@typings/models/button.model'
import { SectionType } from '@features/pages/models/section.model'

export const isButton = (item: SectionType): item is ButtonType => {
  return item.__typename === 'Button'
}
