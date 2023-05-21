import { PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();

export const initialize = async () => {
  await pinecone.init({
    environment: process.env.PDB_ENV,
    apiKey: process.env.PDB_KEY,
  });
  console.log('pinecone initialized')
}

export default pinecone