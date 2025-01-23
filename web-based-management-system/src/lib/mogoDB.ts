const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI as string;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return client; // Return the client for further use
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error; // Rethrow the error for handling in calling functions
    }
}
 


export async function closeConnection() {
    await client.close();
}