import useSWR from "swr";

const url = "/api/my-files"

export default function useMyFiles() {
	const {data, error} = useSWR(url)

	return {
		files: data,
		isLoading: !error && !data,
		isError: error
	}
}