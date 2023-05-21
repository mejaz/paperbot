import pinecone, {initialize} from "@/src/pinecone";
import {getCompletion, getEmbeddings} from "@/src/openaiServices";
import {connectDB} from "@/src/db";
import MyFileModel from "@/src/models/MyFile";

export default async function handler(req, res) {
	const {query, id} = req.body

	await connectDB()
	const myFile = await MyFileModel.findById(id)

	if(!myFile) {
		return res.status(400).send({message: 'invalid file id'})
	}

	await initialize()
	const questionEmb = await getEmbeddings(query)

	const index = pinecone.Index(myFile.vectorIndex)
	const queryRequest = {
		vector: questionEmb,
		topK: 5,
		includeValues: true,
		includeMetadata: true,
	};

	let result = await index.query({queryRequest})
	let contexts = result['matches'].map(item => item['metadata'].text)

	contexts = contexts.join("\n\n---\n\n")

	console.log('--contexts--', contexts)

	const promptStart = `Answer the question based on the context below:\n\n`
	const promptEnd = `\n\nQuestion: ${query} \n\nAnswer:`

	const prompt = `${promptStart} ${contexts} ${promptEnd}`

	console.log('--prompt--', prompt)

	let response = await getCompletion(prompt)

	console.log('--completion--', response)

	res.status(200).json({response})
}
