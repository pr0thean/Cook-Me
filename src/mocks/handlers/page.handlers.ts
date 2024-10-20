import { fixtures } from '@mocks/utils/fixtures'
import { GetPageQuery } from '@services/contentful/generated-types'
import { graphql, HttpResponse } from 'msw'

const getPage = graphql.query<GetPageQuery>('getPage', ({ variables }) => {
  const title = variables.slug.charAt(0).toUpperCase() + variables.slug.slice(1)

  const response: GetPageQuery = {
    __typename: 'Query',
    landingPageCollection: {
      __typename: 'LandingPageCollection',
      items: [
        {
          __typename: 'LandingPage',
          slug: variables.slug,
          hero: {
            __typename: 'Hero',
            heading: title,
            // image: {
            //   __typename: 'Asset',
            //   url: '',
            //   title: '',
            // },
          },
          sectionsCollection: {
            __typename: 'LandingPageSectionsCollection',
            items: [fixtures.recipesButton, fixtures.textBlock],
          },
        },
      ],
    },
  }

  return HttpResponse.json({ data: response })
})

export const pageHandlers = [getPage]
