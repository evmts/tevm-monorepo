import type { FC, ReactNode } from 'react'

import SiteHeader from '../common/site-header'

type BaseLayoutProps = {
	children: ReactNode
}

/**
 * @notice The base layout component for all pages
 */
const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
	return (
		<>
			<SiteHeader />
			<main className="relative flex grow flex-col">{children}</main>
		</>
	)
}

BaseLayout.displayName = 'BaseLayout'

export default BaseLayout
