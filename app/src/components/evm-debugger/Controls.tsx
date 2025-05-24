import { Component, Setter, Show } from 'solid-js'
import { EvmState } from './types'
import { getEvmState, resetEvm, stepEvm, toggleRunPause } from './utils'

interface ControlsProps {
	isRunning: boolean
	setIsRunning: Setter<boolean>
	setError: Setter<string>
	setState: Setter<EvmState>
	isUpdating: boolean
	setIsUpdating: Setter<boolean>
}

const Controls: Component<ControlsProps> = (props) => {
	const handleResetEvm = async () => {
		try {
			props.setError('')
			props.setIsRunning(false)
			const state = await resetEvm()
			props.setState(state)
		} catch (err) {
			props.setError(`${err}`)
		}
	}

	const handleStepEvm = async () => {
		try {
			props.setError('')
			props.setIsUpdating(true)
			const state = await stepEvm()
			props.setState(state)
			setTimeout(() => props.setIsUpdating(false), 50)
		} catch (err) {
			props.setError(`${err}`)
			props.setIsUpdating(false)
		}
	}

	const handleToggleRunPause = async () => {
		try {
			props.setError('')
			props.setIsRunning(!props.isRunning)
			const state = await toggleRunPause()
			props.setState(state)
		} catch (err) {
			props.setError(`${err}`)
			props.setIsRunning(false)
		}
	}

	return (
		<div class="sticky top-16 z-10 mb-6 overflow-hidden">
			<div class="bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
				<div class="p-3 flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={handleResetEvm}
						class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2D2D2D] hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all text-gray-700 dark:text-gray-200 shadow-sm transform hover:translate-y-[-1px] active:translate-y-[1px]"
						aria-label="Reset EVM (R)"
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
						>
							<title>Reset</title>
							<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
							<path d="M3 3v5h5" />
						</svg>
						Reset
					</button>
					<button
						type="button"
						onClick={handleStepEvm}
						class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2D2D2D] hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all text-gray-700 dark:text-gray-200 shadow-sm transform hover:translate-y-[-1px] active:translate-y-[1px]"
						disabled={props.isRunning}
						aria-label="Step EVM (S)"
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
						>
							<title>Step</title>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
						Step
					</button>
					<button
						type="button"
						onClick={handleToggleRunPause}
						class={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all shadow-sm transform hover:translate-y-[-1px] active:translate-y-[1px] ${
							props.isRunning
								? 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-300'
								: 'border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 text-green-700 dark:text-green-300'
						}`}
						aria-label={props.isRunning ? 'Pause EVM (Space)' : 'Run EVM (Space)'}
					>
						<Show
							when={props.isRunning}
							fallback={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Run</title>
									<polygon points="5 3 19 12 5 21 5 3" />
									<polygon points="19 12 5 21 5 3 19 12" />
								</svg>
							}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 mr-1.5 text-red-600 dark:text-red-400"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Pause</title>
								<rect x="6" y="4" width="4" height="16" />
								<rect x="14" y="4" width="4" height="16" />
							</svg>
						</Show>
						{props.isRunning ? 'Pause' : 'Run'}
					</button>

					<div class="ml-auto flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
						<div class="flex items-center">
							<kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs">
								R
							</kbd>
							<span class="ml-1">Reset</span>
						</div>
						<div class="flex items-center">
							<kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs">
								S
							</kbd>
							<span class="ml-1">Step</span>
						</div>
						<div class="flex items-center">
							<kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs">
								Space
							</kbd>
							<span class="ml-1">Run/Pause</span>
						</div>
						<div class="flex items-center">
							<kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs">
								Ctrl
							</kbd>
							<span class="mx-0.5">+</span>
							<kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-mono text-xs">
								D
							</kbd>
							<span class="ml-1">Dark Mode</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Controls
