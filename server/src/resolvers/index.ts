import { TestResolver } from './test.resolver'
import { MoviesResolver } from './movies.resolver'

export const resolvers = [
  new TestResolver().getResolvers(),
  new MoviesResolver().getResolvers()
].reduce(
    (acc, resolver) => {
        return {
            Query: {
                ...acc.Query,
                ...resolver.Query
            },
            Mutation: {
                ...acc.Mutation,
                ...resolver.Mutation
            }
        }
    },
    { Query: {}, Mutation: {} }
);