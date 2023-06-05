# PaperBot

Upload any pdf file and ask questions from that pdf. 

PaperBot generates embeddings from OpenAI embedding model and stores them in Pinecone Vector database. 
To answer user's questions, PaperBot does a semantic search on Pinecone Vector database and further refines the result with OpenAI completion model. 

## Pre-requisites to run this project

1. OpenAI API Key
2. Pinecone Database ENV and KEY
3. MongoDB cluster username and password
4. AWS S3 bucket, access key and access id

## Steps to run this project

1. Clone the repo
2. Run `npm install` to install all the dependencies
3. Create a `.env.local` from `env-example` file: `cp env-example .env.local`
4. Update the OpenAI, Pinecone keys, MongoDB creds and AWS S3 bucket and creds in the `.env.local` file
5. Run `npm run dev` to start the project


### Tech stack

- NextJS
- TailwindCSS
- MongoDB
- Pinecone (Vector DB)
- OpenAI Models - Embedding and Completion

## Contact

mohdejazsiddiqui@gmail.com