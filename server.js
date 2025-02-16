const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const cors = require('cors');
const { authMiddleware } = require('./util/authMiddleware');
const jwt = require('jsonwebtoken');

dotenv.config();

// Initialize Express
const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbname: 'comp3133_101298914_assignment1' })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers['authorization'] || ''; 
    
    if (token) {
      try {
        const tokenWithoutBearer = token.split(' ')[1]; 
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        return { user: decoded }; 
      } catch (err) {
        console.log('Token verification failed:', err);
        return {}; 
      }
    }

    return {}; 
  }
});

async function startServer() {
  // Start Apollo server
  await server.start();

  // Apply middleware to Express app
  server.applyMiddleware({ app });

  // Start Express server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
