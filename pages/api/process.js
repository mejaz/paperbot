import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import MyFileModel from "@/src/models/MyFile";
import {connectDB, disconnectDB} from "@/src/db";
import {getEmbeddings} from "@/src/openaiServices";
import pinecone, {initialize} from "@/src/pinecone";

export default async function handler(req, res) {
	// 1. check for POST call
	if (req.method !== 'POST') {
		return res.status(400).json({message: 'http method not allowed'})
	}

	try {
		// 2. connect to mongodb
		await connectDB()

		// 3. query the file by id
		const {id} = req.body

		const myFile = await MyFileModel.findById(id)

		if (!myFile) {
			return res.status(400).json({message: 'file not found'})
		}

		if(myFile.isProcessed) {
			return res.status(400).json({message: 'file is already processed'})
		}

		// 4. Read PDF and iterate through pages
		let vectors = []

		let myFiledata = await fetch(myFile.fileUrl)

		if (myFiledata.ok) {
			let pdfDoc = await PDFJS.getDocument(await myFiledata.arrayBuffer()).promise
			const numPages = pdfDoc.numPages
			for (let i = 0; i < numPages; i++) {
				let page = await pdfDoc.getPage(i + 1)
				let textContent = await page.getTextContent()
				const text = textContent.items.map(item => item.str).join('');

				// 5. Get embeddings for each page
				const embedding = await getEmbeddings(text)

				// 6. push to vector array
				vectors.push({
					id: `page${i + 1}`,
					values: embedding,
					metadata: {
						pageNum: i + 1,
						text,
					},
				})
			}

			// 7. initialize pinecone
			await initialize() // initialize pinecone

			// 8. connect to the index
			const index = pinecone.Index(myFile.vectorIndex)

			// 9. upsert to pinecone index
			await index.upsert({
				upsertRequest: {
					vectors,
				}
			});

			// 10. update mongodb with isProcessed to true
			myFile.isProcessed = true
			await myFile.save()
			// await disconnectDB()

			// 11. return the response
			return res.status(200).json({message: 'File processed successfully'})
		} else {
			// await disconnectDB()
			return res.status(500).json({message: 'error getting file contents'})
		}
	} catch (e) {
		console.log(e)
		// await disconnectDB()
		return res.status(500).json({message: e.message})
	}
}
