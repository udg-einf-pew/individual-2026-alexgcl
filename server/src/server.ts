import { createServer } from 'http'
import { createSchema, createYoga } from 'graphql-yoga'
import { readFileSync } from 'fs'
import { join } from 'path'
import { resolvers } from './resolvers/index'

const typeDefs = readFileSync(
  join(process.cwd(), 'src', 'schema.graphql'),
  'utf-8'
)

const schema = createSchema({
  typeDefs,
  resolvers
})

const yoga = createYoga({
  schema,
  graphiql: true,
  graphqlEndpoint: '/',
  landingPage: false
})

const server = createServer(yoga)
const port = process.env.PORT ?? 4000

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/`)
})
