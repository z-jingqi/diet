import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8787/api/graphql',
  documents: ['packages/client/src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    'packages/shared/src/graphql/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query'
      ],
      presetConfig: {
        fragmentMasking: false
      },
      config: {
        fetcher: 'graphql-request',
        exposeQueryKeys: true
      }
    }
  }
};

export default config; 
