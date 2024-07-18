import { Entry } from 'contentful'
import { TypeButtonSkeleton } from '@typings/contentful/generated-types/TypeButton'

export type ButtonType = Entry<TypeButtonSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS', string>
