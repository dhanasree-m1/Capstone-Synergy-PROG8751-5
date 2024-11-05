// Use ES module import syntax
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../graphql/schemas/schema.js'; // Import GraphQL schema
import resolvers from '../graphql/resolvers/resolvers.js'; // Import GraphQL resolvers

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Your other routes and logic will go here...

// Connect to MongoDB  
mongoose.connect('mongodb+srv://dhanasree01:Mongo123@cluster0.umw1frd.mongodb.net/HomeBite?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Adjust the timeout duration
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
// Set up Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Optionally add authentication logic here
      const token = req.headers.authorization || "";
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app }); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
startApolloServer();