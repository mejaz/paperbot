// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {connectDB, disconnectDB} from "@/src/db";
import MyFileModel from "@/src/models/MyFile";

export default async function handler(req, res) {
	try {
		await connectDB()
		const files = await MyFileModel.find({})
		// await disconnectDB()
		return res.status(200).json(files)
	} catch (e) {
		return res.status(500).json({message: 'error fetching files'})
	}
}
