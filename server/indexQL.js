import express from "express";
import { ApolloServer } from "apollo-server-express";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { resolvers } from "./graphql/resolvers/resolvers.js";

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Read the GraphQL schema from a file
const typeDefs = fs.readFileSync(
  path.join(__dirname, "graphql/schemas/schema.graphql"),
  "utf-8"
);

// Create a new Apollo Server instance with type definitions and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo Server and then apply it as middleware to the Express app
server.start().then(function () {
  server.applyMiddleware({ app, path: "/graphql", cors: true });
});

const port = process.env.PORT || 3002;
// Start listening on the specified port
app.listen(port, () => {
  console.log(`GraphQL Server is running at http://localhost:${port}`);
});
