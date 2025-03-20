import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google'

import { ThemeProvider } from './components/config/theme-provider'
import { ThemeSwitcher } from './components/config/theme-switcher'
import BaseLayout from './components/layouts/base'
import ContainerLayout from './components/layouts/container'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { METADATA_BASE } from './lib/constants/site'
import { cn } from './lib/utils'

import './tailwind.css'

/* ---------------------------------- FONTS --------------------------------- */
export const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const fontMono = FontMono({
	subsets: ['latin'],
	variable: '--font-mono',
})

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content={METADATA_BASE.description} />
				<Meta />
				<Links />
			</head>
			<body
				className={cn(
					'bg-background flex min-h-screen flex-col font-sans antialiased',
					fontSans.variable,
					fontMono.variable,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						{children}
						<ThemeSwitcher />
					</TooltipProvider>
					<Toaster position="bottom-left" closeButton />
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<BaseLayout>
			<ContainerLayout>
				<Outlet />
			</ContainerLayout>
		</BaseLayout>
	)
}
