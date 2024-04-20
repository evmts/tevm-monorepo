import { Skeleton } from '@/components/ui/skeleton'

/**
 * @notice The root component for the loading page
 * @dev This will be rendered if there is no specific loading component
 * on a page.
 * @dev We're using roughly the layout of the home page for this, especially the header
 * @see Header components/core/header.tsx
 */
const Loading = () => {
	return (
		<div className="flex grow flex-col gap-4">
			<div className="flex w-full flex-col gap-1">
				{/* search label */}
				<div className="h-7 w-full" />
				{/* search bar component */}
				<div className="grid grid-cols-[1fr_min-content] items-center gap-2 sm:flex sm:gap-4">
					{/* search input */}
					<Skeleton className="h-[36px] w-full" />
				</div>
			</div>
			{/* chain selection component */}
			<div className="relative grid grid-cols-[1fr_min-content] justify-between gap-1 sm:flex sm:items-start">
				{/* chain */}
				<Skeleton className="h-[36px] w-[200px] sm:w-[250px]" />
				<div className="grow" />
				{/* fork */}
				<Skeleton className="h-[32px] w-[85px]" />
			</div>
			{/* about */}
			<div className="my-2 flex flex-col gap-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
			{/* transaction history */}
			<div className="grow">
				<Skeleton className="h-[300px] w-full" />
			</div>
		</div>
	)
}

export default Loading
