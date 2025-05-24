import { Component, For, Setter, Show, createSignal } from 'solid-js'
import { EvmState } from './types'
import { copyToClipboard } from './utils'

interface LogsAndReturnProps {
	state: EvmState
	copied: string
	setCopied: Setter<string>
}

const LogsAndReturn: Component<LogsAndReturnProps> = (props) => {
	const [activeTab, setActiveTab] = createSignal('logs')

	const handleCopyLog = (log: string, index: number) => {
		copyToClipboard(log)
		props.setCopied(`Log[${index}]`)
		setTimeout(() => props.setCopied(''), 2000)
	}

	const handleCopyReturnData = () => {
		copyToClipboard(props.state.returnData)
		props.setCopied('Return Data')
		setTimeout(() => props.setCopied(''), 2000)
	}

	return (
		<div class="bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
			<div class="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
				<h2 class="text-sm font-medium text-gray-900 dark:text-white">Logs & Return Data</h2>
				<div class="text-xs text-gray-500 dark:text-gray-400">Event logs and function return data</div>
			</div>
			<div class="border-b border-gray-200 dark:border-gray-800">
				<div class="flex">
					<button
						type="button"
						onClick={() => setActiveTab('logs')}
						class={`px-4 py-2 text-sm font-medium transition-colors ${
							activeTab() === 'logs'
								? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
								: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
						}`}
						aria-label="Show logs"
					>
						Logs ({props.state.logs.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('returnData')}
						class={`px-4 py-2 text-sm font-medium transition-colors ${
							activeTab() === 'returnData'
								? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
								: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
						}`}
						aria-label="Show return data"
					>
						Return Data
					</button>
				</div>
			</div>
			<div class="p-0 max-h-[250px] overflow-y-auto">
				<Show when={activeTab() === 'logs'}>
					<Show
						when={props.state.logs.length > 0}
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
									<title>Logs</title>
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
								</svg>
								No logs emitted
							</div>
						}
					>
						<div class="divide-y divide-gray-100 dark:divide-gray-800">
							<For each={props.state.logs}>
								{(log, index) => (
									<div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors group">
										<div class="flex justify-between items-center">
											<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Log {index()}:</span>
											<button
												type="button"
												onClick={() => handleCopyLog(log, index())}
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
										<div class="mt-1 font-mono text-sm text-gray-900 dark:text-white break-all">{log}</div>
									</div>
								)}
							</For>
						</div>
					</Show>
				</Show>
				<Show when={activeTab() === 'returnData'}>
					<Show
						when={props.state.returnData !== '0x' && props.state.returnData.length > 2}
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
									<title>Return data</title>
									<path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" />
									<path d="M9 15v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
									<path d="M6 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" />
								</svg>
								No return data
							</div>
						}
					>
						<div class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2D2D2D] transition-colors group">
							<div class="flex justify-between items-center">
								<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Return Data:</span>
								<button
									type="button"
									onClick={handleCopyReturnData}
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
							<div class="mt-1 font-mono text-sm text-gray-900 dark:text-white break-all">{props.state.returnData}</div>
						</div>
					</Show>
				</Show>
			</div>
		</div>
	)
}

export default LogsAndReturn
