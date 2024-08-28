import type { CodegenConfig } from '@graphql-codegen/cli'

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_ACCESS_TOKEN is not set')
}

const config: CodegenConfig = {
  overwrite: true,
  documents: ['./src/services/contentful/**/*.graphql'],
  schema: {
    [`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`]: {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      },
    },
  },
  generates: {
    './src/services/contentful/generated-types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
    './contentful.schema.json': {
      plugins: ['introspection'],
    },
  },
}
export default config
