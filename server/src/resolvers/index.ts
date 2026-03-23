import { TestResolver } from './test.resolver'
import { MoviesResolver } from './movies.resolver'
import { UsersResolver } from './users.resolver'

export const resolvers = [
  new TestResolver().getResolvers(),
  new MoviesResolver().getResolvers(),
  new UsersResolver().getResolvers()
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