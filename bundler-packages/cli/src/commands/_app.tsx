import type { AppProps } from 'pastel'

export default function App({ Component, commandProps }: AppProps) {
return <Component {...commandProps} />
}
