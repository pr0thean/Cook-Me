import { SectionType } from '@typings/models/section.model'
import { TextBlockType } from '@typings/models/text-block.model'

export const isTextBlock = (item: SectionType): item is TextBlockType => {
  return item.__typename === 'TextBlock'
}
