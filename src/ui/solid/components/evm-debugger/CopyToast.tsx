import { Component, Show } from 'solid-js'

interface CopyToastProps {
	copied: string
}

const CopyToast: Component<CopyToastProps> = (props) => {
	return (
		<Show when={props.copied}>
			<div class="fixed bottom-4 right-4 bg-white dark:bg-[#252525] text-gray-900 dark:text-white rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center space-x-2 animate-fade-in">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-green-500 dark:text-green-400"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-label="Success checkmark"
				>
					<title>Success checkmark</title>
					<path d="M20 6 9 17l-5-5" />
				</svg>
				<span>Copied {props.copied} to clipboard</span>
			</div>
		</Show>
	)
}

export default CopyToast
