import clc from 'cli-color'
import { createServer } from 'node:http'
import { createYoga, createSchema } from 'graphql-yoga'
import { readFileSync } from 'fs'
import { join } from 'path'
import { resolvers } from './resolvers'
import { connect } from 'mongoose';

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8')

// Create a Yoga instance with a GraphQL schema.
const schema = createSchema({ typeDefs, resolvers })
const yoga = createYoga({ schema })

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Connect to the database before starting the server
connectToDatabase().then(() => {
// Start the server and you're done!
server.listen(4000, () => {
console.info(clc.blueBright('Server is running on http://localhost:4000/graphql'))
})
}).catch((error) => {
console.error(clc.redBright('Error starting the server:'), error);
process.exit(1);
});

async function connectToDatabase() {
  const connectionStr =
    'mongodb://alexgcl2004_db_user:Alex12345%21@ac-dhn5m9w-shard-00-00.wjvbgbr.mongodb.net:27017,ac-dhn5m9w-shard-00-01.wjvbgbr.mongodb.net:27017,ac-dhn5m9w-shard-00-02.wjvbgbr.mongodb.net:27017/dbmovies?ssl=true&replicaSet=atlas-10wj81-shard-0&authSource=admin&appName=Cluster0';

  try {
    await connect(connectionStr);
    console.info(clc.greenBright('Connectat a la base de dades dbmovies'));
  } catch (error) {
    console.error(clc.redBright('Failed to connect to MongoDB:'), error);
    process.exit(1);
  }
}
