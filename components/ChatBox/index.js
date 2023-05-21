import {MdSend} from "react-icons/md"
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import ChooseFileAlert from "@/components/ChatBox/ChooseFileAlert";
import ReadyAlert from "@/components/ChatBox/ReadyAlert";
import Chat from "@/components/ChatBox/Chat";
import FileNotProcessedAlert from "@/components/ChatBox/FileNotProcessedAlert";

export default function ChatBox({activeFile}) {
	const divRef = useRef(null);
	const [chat, setChat] = useState([])
	const [query, setQuery] = useState()
	const [id, setId] = useState()

	const scrollToBottom = () => {
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	}

	useEffect(() => {
		scrollToBottom()
		console.log('msg added')
	}, [chat.length]);

	const addChat = (query, response, id) => {
		setChat(prevState => [...prevState, {
			query,
			response,
		}])

		setQuery(query)
		setId(id)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const query = e.target.query.value;
		const id = e.target.id.value;

		e.target.query.value = null;

		console.log(query, id);
		addChat(query, null, id);
	}

	const updateLastChat = (query, response) => {
		console.log("--old chat--", chat)
		const oldChats = [...chat]
		oldChats.pop()
		setChat([...oldChats, {
			query,
			response,
		}])
	}

	useEffect(() => {
		const fetchChatResponse = async () => {
			let response = await fetch("/api/query", {
				method: 'POST',
				body: JSON.stringify({query, id}),
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.ok) {
				response = await response.json();
				updateLastChat(query, response.response);
			} else {
				response = await response.json();
				toast.error(response.message)
			}
		};

		if (query) {
			fetchChatResponse().then(() => console.log('response received'));
		}
	}, [query]);


	return (
		<div className={"border h-full flex flex-col"}>
			<div className={"flex flex-col border text-center py-1 bg-[#ef8e38] text-white"}>
				{activeFile ? activeFile.fileName : "Choose a file to start chatting"}
			</div>
			<div className={"border p-3 grow flex flex-col justify-end h-[calc(100vh-270px)]"}>
				{activeFile
					? !activeFile.isProcessed
						? <FileNotProcessedAlert id={activeFile._id}/>
						: chat.length > 0
							? <div ref={divRef} className={"overflow-auto"}>
								{
									chat.map(({query, response}, index) => (
										<Chat key={index} query={query} response={response}/>
									))
								}
								<div ref={divRef}/>
							</div>
							: <ReadyAlert/>
					: <ChooseFileAlert/>
				}
			</div>

			<form onSubmit={handleSubmit}>
				<div className={"border p-3 flex justify-between items-center space-x-2"}>
					<input name={'query'} className={"w-full m-0 outline-0"} placeholder={"Type here..."}/>
					<input name={'id'} value={activeFile ? activeFile._id : ''} hidden readOnly/>
					<button
						type="submit"
						className="inline-block rounded-full p-1 text-primary-main outline-0">
						<MdSend size={24}/>
					</button>
				</div>
			</form>
		</div>
	)
}