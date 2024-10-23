import { ButtonType } from '@typings/models/button.model'
import { TextBlockType } from '@typings/models/text-block.model'
import { textBlockJson } from './text-block-json'

type TextBlockTypeContent = {
  __typename: TextBlockType['content']['__typename']
  json: Required<TextBlockType['content']['json']>
}
type TextBlockWithJsonRequired = {
  __typename: TextBlockType['__typename']
  heading: TextBlockType['heading']
  content: TextBlockTypeContent
}

const textBlock: TextBlockWithJsonRequired = {
  __typename: 'TextBlock',
  heading: 'TextBlock Heading',
  content: {
    __typename: 'TextBlockContent',
    json: textBlockJson,
  },
}

const recipesButton: ButtonType = {
  __typename: 'Button',
  label: 'Browse recipes',
  link: '/recipes',
}

export const fixtures = {
  recipesButton,
  textBlock,
}
