import type { FC } from 'react'
import SearchBar from '@/components/core/search-bar'
import ChainSelection from '@/components/core/selection/chain'
import { useProviderStore } from '@/lib/store/use-provider'

type HeaderProps = {
	initialAddress?: string
}

/**
 * @notice The header of the app, where the user can search for an account and interact with
 * the chain (select & reset)
 * @dev This will render a skeleton until the app is hydrated, because you don't want to render
 * it with default values (instead of the ones saved in local storage), as this would only be confusing
 * to the user.
 * @param initialAddress The researched address, if relevant (not on the home page)
 */
const Header: FC<HeaderProps> = ({ initialAddress }) => {
	const isHydrated = useProviderStore((state) => state.isHydrated)

	return (
		<>
			<SearchBar initialAddress={initialAddress} hydrating={!isHydrated} />
			<ChainSelection hydrating={!isHydrated} />
		</>
	)
}

export default Header
