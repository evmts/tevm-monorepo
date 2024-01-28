import type { AppProps } from 'pastel'
import React from 'react'

export default function App({ Component, commandProps }: AppProps) {
	return <Component {...commandProps} />
}
