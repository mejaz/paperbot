import formidable from 'formidable-serverless';
import {connectDB, disconnectDB} from '@/src/db'
import MyFileModel from "@/src/models/MyFile";
import slugify from 'slugify'
import pinecone, {initialize} from "../../src/pinecone";
import {s3Upload} from "@/src/s3services";

export const config = {
	api: {
		bodyParser: false,
	},
};

const createIndex = async (indexName) => {
	const indexes = await pinecone.listIndexes()
	if (!indexes.includes(indexName)) {
		await pinecone.createIndex({
			createRequest: {
				name: indexName,
				dimension: 1536,  // fixed for OPENAI embeddings
			},
		});
		console.log('index created')
	} else {
		throw new Error(`Index with name ${indexName} already exists`)
	}
}

export default async function handler(req, res) {
	// 1. only allow POST methods
	if (req.method !== 'POST') {
		return res.status(400).send('method not supported')
	}

	try {
		// 2. connect to the mongodb db
		await connectDB()

		// 3. parse the incoming FormData
		let form = new formidable.IncomingForm();

		form.parse(req, async (error, fields, files) => {
			if (error) {
				console.error('Failed to parse form data:', error);
				return res.status(500).json({error: 'Failed to parse form data'});
			}

			const file = files.file;

			// Check if the file object exists
			if (!file) {
				return res.status(400).json({error: 'No file uploaded'});
			}

			// Check if the necessary file properties are available
			if (!file.name || !file.path || !file.type) {
				return res.status(400).json({error: 'Invalid file data'});
			}

			// 4. upload the file to s3
			let data = await s3Upload(process.env.S3_BUCKET, file)

			// 5. initialize pinecone
			const filenameWithoutExt = file.name.split(".")[0]
			const filenameSlug = slugify(filenameWithoutExt, {
				lower: true, strict: true
			})

			await initialize()  // initialize pinecone

			// 6. create a pinecone index
			await createIndex(filenameSlug)  // create index

			// 7. save file info to the mongodb db
			const myFile = new MyFileModel({
				fileName: file.name,
				fileUrl: data.Location,
				vectorIndex: filenameSlug,
			})
			await myFile.save()
			// await disconnectDB()

			// 8. return the success response
			return res.status(200).json({message: 'File uploaded to S3 and index created'});
		})
	} catch (e) {
		console.log("--error--", e)
		// await disconnectDB()
		return res.status(500).send({message: e.message})
	}
}
