import {useState} from 'react';
import toast from "react-hot-toast";

export default function FileUpload() {
	const [file, setFile] = useState();
	const [uploading, setUploading] = useState(false)

	const handleFileChange = (e) => {
		if (e.target.files) {
			let file = e.target.files[0]

			if (file.type !== 'application/pdf') {
				toast.error('Only PDF files are allowed')
				e.target.value = null
				return
			}
			setFile(file);
		}
	};

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}

		setUploading(true)
		const formData = new FormData();
		formData.append('file', file);

		// 👇 Uploading the file using the fetch API to the server
		let response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		})
		if (response.ok) {
			response = await response.json()
			toast.success(response.message)
		} else {
			response = await response.json()
			toast.error(response.message)
		}
		setUploading(false)
	};

	return (
		<div className="mb-3">
			<div>
				<label
					htmlFor="formFile"
					className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
				>Upload a PDF File</label
				>
				<input
					className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
					type="file"
					id="formFile"
					onChange={handleFileChange}
				/>
			</div>

			<div className={"text-right py-2"}>
				<button
					type="button"
					onClick={handleUploadClick}
					disabled={uploading}
					className="inline-block rounded bg-primary-main px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-sm transition duration-150 ease-in-out hover:bg-primary-dark hover:shadow-md focus:bg-primary-dark active:bg-primary-light disabled:bg-primary-light disabled:cursor-not-allowed">
					{uploading ? 'Please wait...' : 'Upload'}
				</button>
			</div>
		</div>
	)
}