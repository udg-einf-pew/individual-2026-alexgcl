import { TestResolver } from './test.resolver'
export const resolvers = [
new TestResolver().getResolvers()
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