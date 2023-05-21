import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import MyFileModel from "@/src/models/MyFile";
import {connectDB, disconnectDB} from "@/src/db";
import {getEmbeddings} from "@/src/openaiServices";
import pinecone, {initialize} from "@/src/pinecone";

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(400).json({message: 'http method not allowed'})
	}

	try {
		const {id} = req.body

		await connectDB()

		const myFile = await MyFileModel.findById(id)
		let vectors = []

		if (!myFile) {
			return res.status(400).json({message: 'file not found'})
		}

		if(myFile.isProcessed) {
			return res.status(400).json({message: 'file is already processed'})
		}

		let myFiledata = await fetch(myFile.fileUrl)

		if (myFiledata.ok) {
			let pdfDoc = await PDFJS.getDocument(await myFiledata.arrayBuffer()).promise
			const numPages = pdfDoc.numPages
			for (let i = 0; i < numPages; i++) {
				let page = await pdfDoc.getPage(i + 1)
				let textContent = await page.getTextContent()
				const text = textContent.items.map(item => item.str).join('');

				const embedding = await getEmbeddings(text)
				vectors.push({
					id: `page${i + 1}`,
					values: embedding,
					metadata: {
						pageNum: i + 1,
						text,
					},
				})
			}
			await initialize() // initialize pinecone
			const index = pinecone.Index(myFile.vectorIndex)
			await index.upsert({
				upsertRequest: {
					vectors,
				}
			});

			myFile.isProcessed = true
			await myFile.save()
			// await disconnectDB()
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
