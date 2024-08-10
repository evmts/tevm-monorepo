import type { AppProps } from 'pastel'
import { createElement } from 'react'

export default function App({ Component, commandProps }: AppProps) {
	return createElement(Component, commandProps)
}
