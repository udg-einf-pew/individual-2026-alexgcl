export class TestResolver {
    getResolvers() {
        return {
            Query: {
                test: () => 'Hello world!'
            },
            Mutation: {}
        }
    }
}