import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL ?? 'https://stackd-platform-core.onrender.com'}/graphql`,
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          liveContest: {
            read(_, { args, toReference }) {
              return toReference({ __typename: 'Contest', id: args?.id })
            },
          },
        },
      },
      Contest: { keyFields: ['id'] },
      CreatorWallet: { keyFields: ['id'] },
      Payment: { keyFields: ['id'] },
      Withdrawal: { keyFields: ['id'] },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
