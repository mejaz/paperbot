import '@/styles/globals.css'
import {SWRConfig} from 'swr'
import { Toaster } from 'react-hot-toast';


export default function App({Component, pageProps}) {
	return (
		<SWRConfig
			value={{
				fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
			}}
		>
			<Component {...pageProps} />
			<Toaster />
		</SWRConfig>
	)
}
