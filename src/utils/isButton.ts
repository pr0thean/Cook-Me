import { ButtonType } from '@typings/Button'
import { Entry, EntrySkeletonType } from 'contentful'

export const isButton = (
  entry: Entry<EntrySkeletonType, 'WITHOUT_UNRESOLVABLE_LINKS', string>
): entry is ButtonType => {
  return entry.sys.contentType.sys.id === 'button'
}
