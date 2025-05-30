import { Component, Setter, Show } from 'solid-js'
import { sampleContracts } from './types'

interface HeaderProps {
	showSample: boolean
	setShowSample: Setter<boolean>
	isDarkMode: boolean
	setIsDarkMode: Setter<boolean>
	setBytecode: Setter<string>
	activePanel: string
	setActivePanel: Setter<string>
}

const Header: Component<HeaderProps> = (props) => {
	return (
		<header class="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-[#1E1E1E]/80">
			<div class="max-w-7xl mx-auto">
				<div class="flex justify-between h-16 items-center px-4 sm:px-6">
					<div class="flex items-center space-x-4">
						<div class="flex items-center">
							<div class="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-label="EVM Debugger icon"
								>
									<title>EVM Debugger icon</title>
									<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
									<path d="M8 7h.01M12 7h.01M16 7h.01" />
								</svg>
							</div>
							<h1 class="ml-2.5 text-lg font-medium text-gray-900 dark:text-white">EVM Debugger</h1>
						</div>

						<div class="hidden md:flex space-x-1 ml-6">
							<button
								type="button"
								onClick={() => props.setActivePanel('all')}
								class={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									props.activePanel === 'all'
										? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
								}`}
							>
								All Panels
							</button>
							<button
								type="button"
								onClick={() => props.setActivePanel('stack')}
								class={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									props.activePanel === 'stack'
										? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
								}`}
							>
								Stack
							</button>
							<button
								type="button"
								onClick={() => props.setActivePanel('memory')}
								class={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									props.activePanel === 'memory'
										? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
								}`}
							>
								Memory
							</button>
							<button
								type="button"
								onClick={() => props.setActivePanel('storage')}
								class={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									props.activePanel === 'storage'
										? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
								}`}
							>
								Storage
							</button>
							<button
								type="button"
								onClick={() => props.setActivePanel('logs')}
								class={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									props.activePanel === 'logs'
										? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
								}`}
							>
								Logs
							</button>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="relative">
							<button
								type="button"
								onClick={() => props.setShowSample(!props.showSample)}
								class="px-3 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-colors text-gray-700 dark:text-gray-200 flex items-center"
								aria-label="Load sample contract"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-label="File icon"
								>
									<title>File icon</title>
									<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
									<polyline points="14 2 14 8 20 8" />
								</svg>
								Samples
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class={`h-4 w-4 ml-1.5 transition-transform duration-200 ${props.showSample ? 'rotate-180' : ''}`}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-label="Chevron"
								>
									<title>Chevron</title>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</button>
							<Show when={props.showSample}>
								<div class="absolute right-0 mt-2 w-72 bg-white dark:bg-[#252525] rounded-md shadow-lg border border-gray-200 dark:border-gray-800 z-30 overflow-hidden">
									<div class="p-1">
										<div class="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
											Sample Contracts
										</div>
										{sampleContracts.map((contract, index) => (
											<button
												key={index}
												type="button"
												onClick={() => {
													props.setBytecode(contract.bytecode)
													props.setShowSample(false)
												}}
												class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-md transition-colors flex flex-col"
											>
												<span class="font-medium">{contract.name}</span>
												<span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{contract.description}</span>
											</button>
										))}
									</div>
								</div>
							</Show>
						</div>
						<button
							type="button"
							onClick={() => props.setIsDarkMode(!props.isDarkMode)}
							class="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-colors"
							aria-label="Toggle dark mode"
						>
							<Show
								when={props.isDarkMode}
								fallback={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Moon icon</title>
										<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
									</svg>
								}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Sun icon</title>
									<circle cx="12" cy="12" r="4" />
									<path d="M12 2v2" />
									<path d="M12 20v2" />
									<path d="m4.93 4.93 1.41 1.41" />
									<path d="m17.66 17.66 1.41 1.41" />
									<path d="M2 12h2" />
									<path d="M20 12h2" />
									<path d="m6.34 17.66-1.41 1.41" />
									<path d="m19.07 4.93-1.41 1.41" />
								</svg>
							</Show>
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
