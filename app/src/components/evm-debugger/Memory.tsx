import { Component, For, Setter, Show } from 'solid-js'
import { EvmState, formatMemory } from './types'
import { copyToClipboard } from './utils'

interface MemoryProps {
	state: EvmState
	copied: string
	setCopied: Setter<string>
}

const Memory: Component<MemoryProps> = (props) => {
	const handleCopy = (chunk: string, index: number) => {
		copyToClipboard(`0x${chunk}`)
		props.setCopied(`Memory[0x${(index * 32).toString(16)}]`)
		setTimeout(() => props.setCopied(''), 2000)
	}

	const memoryChunks = () => formatMemory(props.state.memory)

	return (
		<div class="bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
			<div class="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
				<h2 class="text-sm font-medium text-gray-900 dark:text-white">Memory</h2>
				<div class="text-xs text-gray-500 dark:text-gray-400">Hexadecimal representation</div>
			</div>
			<div class="p-0 max-h-[300px] overflow-y-auto">
				<Show
					when={memoryChunks().length > 0}
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
								<title>Memory</title>
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="M10 4v4" />
								<path d="M2 8h20" />
								<path d="M6 12h.01" />
								<path d="M10 12h.01" />
								<path d="M14 12h.01" />
								<path d="M18 12h.01" />
								<path d="M6 16h.01" />
								<path d="M10 16h.01" />
								<path d="M14 16h.01" />
								<path d="M18 16h.01" />
							</svg>
							Memory is empty
						</div>
					}
				>
					<div class="divide-y divide-gray-100 dark:divide-gray-800">
						<For each={memoryChunks()}>
							{(chunk, index) => (
								<div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors flex justify-between group">
									<div class="flex items-start">
										<span class="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 pt-0.5 font-mono">
											0x{(index() * 32).toString(16).padStart(4, '0')}:
										</span>
										<span class="font-mono text-sm text-gray-900 dark:text-white ml-2 break-all">{chunk}</span>
									</div>
									<button
										type="button"
										onClick={() => handleCopy(chunk, index())}
										class="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 mt-0.5"
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
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	)
}

export default Memory
