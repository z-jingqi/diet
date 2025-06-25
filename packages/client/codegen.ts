import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8787/api/graphql',
  documents: ['src/**/*.{ts,tsx,graphql}'],
  generates: {
    './src/lib/gql/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: 'graphql-request',
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQueryParam: true,
        dedupeOperationSuffix: true,
        skipTypename: false,
        useTypeImports: true,
        reactQueryVersion: 5,
        legacyMode: false,
        documentMode: 'documentNode',
        importTypes: true,
        dedupeFragments: true,
        avoidOptionals: {
          field: false,
          inputValue: false,
          object: false,
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config; 
