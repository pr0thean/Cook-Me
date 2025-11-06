import { textBlockJson } from './text-block-json'

const textBlock = {
  heading: 'TextBlock Heading',
  content: {
    json: textBlockJson,
  },
}

const recipesButton = {
  label: 'Browse recipes',
  link: '/recipes',
}

export const fixtures = {
  recipesButton,
  textBlock,
}
