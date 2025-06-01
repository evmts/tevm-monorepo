import { Component, For, Setter, Show } from 'solid-js'
import { EvmState, formatHex, formatStorage } from './types'
import { copyToClipboard } from './utils'

interface StorageProps {
	state: EvmState
	copied: string
	setCopied: Setter<string>
}

const Storage: Component<StorageProps> = (props) => {
	const handleCopy = (key: string, value: string) => {
		copyToClipboard(`${key}: ${value}`)
		props.setCopied(`Storage[${formatHex(key)}]`)
		setTimeout(() => props.setCopied(''), 2000)
	}

	const storageItems = () => formatStorage(props.state.storage)

	return (
		<div class="bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
			<div class="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
				<h2 class="text-sm font-medium text-gray-900 dark:text-white">
					Storage ({Object.keys(props.state.storage).length})
				</h2>
				<div class="text-xs text-gray-500 dark:text-gray-400">Key-value pairs</div>
			</div>
			<div class="p-0 max-h-[300px] overflow-y-auto">
				<Show
					when={Object.keys(props.state.storage).length > 0}
					fallback={
						<div class="p-8 text-sm text-gray-500 dark:text-gray-400 italic flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Storage</title>
								<path d="M2 10V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2" />
								<path d="M10 2v4" />
								<path d="M2 6h20" />
								<path d="M10 18v4" />
								<path d="M2 18h20" />
							</svg>
							Storage is empty
						</div>
					}
				>
					<div class="divide-y divide-gray-100 dark:divide-gray-800">
						<For each={storageItems()}>
							{(item) => (
								<div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors group">
									<div class="flex justify-between items-center">
										<div class="flex items-center">
											<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Key:</span>
											<span class="font-mono text-sm text-gray-900 dark:text-white ml-2">{formatHex(item.key)}</span>
										</div>
										<button
											type="button"
											onClick={() => handleCopy(item.key, item.value)}
											class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
											aria-label="Copy to clipboard"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Copy</title>
												<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
												<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
											</svg>
										</button>
									</div>
									<div class="flex items-center mt-1">
										<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Value:</span>
										<span class="font-mono text-sm text-gray-900 dark:text-white ml-2">{formatHex(item.value)}</span>
									</div>
								</div>
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	)
}

export default Storage
