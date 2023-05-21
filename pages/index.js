import FileUpload from "@/components/FileUpload";
import MyFiles from "@/components/MyFiles";
import Intro from "@/components/Intro";
import ChatBox from "@/components/ChatBox";
import {useState} from "react";
import useMyFiles from "@/apiHooks/useMyFiles";
import Head from 'next/head'

export default function Home() {
	const [activeFile, setActiveFile] = useState()
	const {files, isError, isLoading} = useMyFiles()

	if (isLoading) {
		return <h1>Loading...</h1>
	}

	return (
		<>
			<Head>
				<title>Paperbot - Chat with my PDF</title>
			</Head>
			<main
				className={`w-full h-screen`}
			>
				<div className={"max-w-5xl mx-auto"}>
					<h1
						className={"inline-block text-transparent px-5 lg:px-0 bg-clip-text py-4 text-3xl font-bold bg-gradient-to-r from-[#108dc7] to-[#ef8e38] font-squarePeg"}
					>
						PaperBot
					</h1>
					<div className={"mt-5 px-5 lg:px-0 h-[calc(100vh-170px)] min-h-[calc(100vh-170px)]"}>
						<div className={"grid lg:grid-cols-2 gap-8 h-[inherit]"}>
							<div>
								<Intro/>
								<FileUpload/>
								<MyFiles setActiveFile={setActiveFile} files={files}/>
							</div>
							<div>
								<ChatBox activeFile={activeFile}/>
							</div>
						</div>
					</div>
				</div>

			</main>
		</>
	)
}
