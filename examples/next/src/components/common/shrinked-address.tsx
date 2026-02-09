'use client'

import Link from 'next/link'
import { type FC, useMemo, useState } from 'react'
import { useMedia } from 'react-use'
import type { Address } from 'tevm/utils'

import { Icons } from '@/components/common/icons'

type ShrinkedAddressProps = {
	address: Address
	explorer?: string
	adapt?: boolean
}

/**
 * @notice A component to display a shrinked version of an Ethereum address
 * @dev The component will display the first 6 and the last 4 characters of the address,
 * with a "..." in between, and a tooltip with the full address.
 * Depending on the size of the screen, the full address will be displayed or not.
 * @param address The Ethereum address to display
 * @param explorer The URL of the explorer to link the address to
 * @param adapt Whether to adapt the display to the screen size (default: true)
 */
const ShrinkedAddress: FC<ShrinkedAddressProps> = ({
	address = '0x', // default to avoid errors
	explorer,
	adapt = true,
}) => {
	const isLargeScreen = useMedia('(min-width: 1280px)') // xl
	const [copy, setCopy] = useState(false)

	// Display the full address only on large screens (if adapt is true)
	const fullAddress = useMemo(() => {
		if (isLargeScreen && adapt) return true
		return false
	}, [isLargeScreen, adapt])

	// Open the address in the explorer for this chain
	const openExplorerTab = () => {
		if (!explorer) return
		window.open(`${explorer.endsWith('/') ? explorer : `${explorer}/`}address/${address}`, '_blank')
	}

	// Copy the address to the clipboard (and update the icon)
	const CopyButton = useMemo(() => {
		const copyToClipboard = () => {
			navigator.clipboard.writeText(address)
			setCopy(true)
			setTimeout(() => setCopy(false), 2000)
		}

		if (copy) {
			return <Icons.copyCheck className="mx-2 size-3 sm:mx-0" />
		}

		return (
			<Icons.copyAction
				className="mx-2 size-3 cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-80 sm:mx-0"
				onClick={copyToClipboard}
				aria-label="Copy to clipboard"
			/>
		)
	}, [address, copy])

	if (explorer)
		return (
			<div className="flex items-center gap-2">
				<Link href={address} className="cursor-pointer hover:underline">
					<pre>{fullAddress ? address : `0x${address.slice(2, 6)}...${address.slice(-4)}`}</pre>
				</Link>
				{CopyButton}
				<Icons.external
					className="mx-2 size-3 cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-80 sm:mx-0"
					onClick={openExplorerTab}
					aria-label="Open in explorer"
				/>
			</div>
		)

	return (
		<div className="flex items-center gap-2">
			<Link href={address} className="cursor-pointer hover:underline">
				<pre>{fullAddress ? address : `0x${address.slice(2, 6)}...${address.slice(-4)}`}</pre>
			</Link>
			{CopyButton}
		</div>
	)
}

export default ShrinkedAddress
