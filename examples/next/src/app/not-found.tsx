import Link from 'next/link'

import { Button } from '@/components/ui/button'

/**
 * @notice The root component for the 404 page
 */
const NotFound = () => {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-lg font-medium">Page not found</h2>
			<p className="text-secondary-foreground">It seems like the page you are looking for does not exist.</p>
			<Button asChild>
				<Link href="/">Return Home</Link>
			</Button>
		</div>
	)
}

export default NotFound
