import { Show } from 'solid-js'

interface CopyToastProps {
	copied: string
}

export const CopyToast = (props: CopyToastProps) => {
	if (!props.copied) return null

	return (
		<div class="fixed bottom-4 right-4 bg-[#FFFFFF] dark:bg-[#252525] text-gray-900 dark:text-[#FFFFFF] rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center space-x-2 animate-fade-in">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-green-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-label="Success checkmark"
			>
				<title>Success checkmark</title>
				<path d="M20 6 9 17l-5-5" />
			</svg>
			<span>Copied {props.copied} to clipboard</span>
		</div>
	)
}
