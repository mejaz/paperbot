import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_ID,
	secretAccessKey: process.env.AWS_ACCESS_KEY,
	region: 'ap-south-1',
});

export const s3Upload = async (bucket, file) => {
	const params = {
		Bucket: bucket,
		Key: file.name,
		Body: fs.createReadStream(file.path),
	};

	return await s3.upload(params).promise()
}