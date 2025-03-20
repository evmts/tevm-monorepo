import { Link } from '@remix-run/react'

import { METADATA_BASE } from '../../lib/constants/site'

/**
 * @notice The navigation bar for all pages
 */
const NavBar = () => {
	return (
		<nav className="flex items-center space-x-4">
			<Link to="/" className="font-medium">
				{METADATA_BASE.title as string}
			</Link>
		</nav>
	)
}

export default NavBar
