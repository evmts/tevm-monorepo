import NavBar from './components/nav'
import { chains, config } from './wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import { WagmiConfig } from 'wagmi'

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body
				style={{ backgroundColor: 'rgb(50, 58, 67)', padding: 0, margin: 0 }}
			>
				<WagmiConfig config={config}>
					<RainbowKitProvider chains={chains}>
						<NavBar />
						<Outlet />
						<ScrollRestoration />
						<LiveReload />
						<Scripts />
					</RainbowKitProvider>
				</WagmiConfig>
			</body>
		</html>
	)
}
