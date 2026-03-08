import clc from 'cli-color'
import { createServer } from 'node:http'
import { createYoga, createSchema } from 'graphql-yoga'
import { readFileSync } from 'fs'
import { join } from 'path'
import { resolvers } from './resolvers'

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')

// Create a Yoga instance with a GraphQL schema.
const schema = createSchema({ typeDefs, resolvers })
const yoga = createYoga({ schema })

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000, () => {
 console.info(clc.blueBright('Server is running on http://localhost:4000/graphql'))
})
