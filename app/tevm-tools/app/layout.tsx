import type React from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Tevm Tools',
	description: 'Solidity Debugger',
	generator: 'v0.dev',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
