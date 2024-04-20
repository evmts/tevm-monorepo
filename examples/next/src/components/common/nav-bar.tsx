'use client'

import Link from 'next/link'

import { METADATA_BASE } from '@/lib/constants/site'

/**
 * @notice The navigation bar for all pages
 */
const NavBar = () => {
	return (
		<nav className="flex items-center space-x-4">
			<Link href="/" passHref className="font-medium">
				{METADATA_BASE.title as string}
			</Link>
		</nav>
	)
}

export default NavBar
