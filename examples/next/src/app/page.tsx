'use client'

import dynamic from 'next/dynamic'

import About from '@/components/core/about'

// Import dynamically to avoid SSR issues due to persisted state (see zustand stores)
const Header = dynamic(() => import('@/components/core/header'))
const TxHistory = dynamic(() => import('@/components/core/tx-history'))

export default function Home() {
	return (
		<div className="flex grow flex-col gap-4">
			<Header />
			<About />
			<TxHistory />
		</div>
	)
}
