import AnimatedEllipsis from "@/components/AnimatedEllipsis";

export default function Chat({query, response}) {
	return (
		<div>
			{query && <div className={"w-full p-2 border-b mb-2 flex items-center"}>
				<div className={"w-8 h-8 flex-shrink-0 rounded-full bg-amber-600 mr-2"}/>
				<div>{query}</div>
			</div>}
			{response && <div className={"w-full p-2 border-b mb-2 flex items-center justify-end"}>
				<div>{response ? response : <AnimatedEllipsis/>}</div>
				<div className={"w-8 h-8 flex-shrink-0 rounded-full bg-purple-500 ml-2"}/>
			</div>}
		</div>
	)
}
