import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated-types'

const generateGraphQLClient = () => {
  if (!process.env.CONTENTFUL_SPACE_ID) {
    throw new Error('CONTENTFUL_SPACE_ID is not set')
  }

  return new GraphQLClient(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
      errorPolicy: 'ignore',
    }
  )
}

export const getContentfulClient = () => {
  return getSdk(generateGraphQLClient())
}
