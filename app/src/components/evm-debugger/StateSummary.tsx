import { Component } from 'solid-js'
import { EvmState } from './types'

interface StateSummaryProps {
	state: EvmState
	isUpdating: boolean
}

const StateSummary: Component<StateSummaryProps> = (props) => {
	return (
		<div
			class={`mb-6 bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden ${
				props.isUpdating ? 'animate-pulse' : ''
			}`}
		>
			<div class="grid grid-cols-2 md:grid-cols-4">
				<div class="p-4 flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-200 dark:border-gray-800">
					<div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">PC</div>
					<div class="text-2xl font-mono font-semibold text-gray-900 dark:text-white">{props.state.pc}</div>
				</div>
				<div class="p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
					<div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Opcode</div>
					<div class="text-lg font-mono font-semibold px-2.5 py-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-300 rounded-full">
						{props.state.opcode}
					</div>
				</div>
				<div class="p-4 flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-800">
					<div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Gas Left</div>
					<div class="text-2xl font-mono font-semibold text-gray-900 dark:text-white">{props.state.gasLeft}</div>
				</div>
				<div class="p-4 flex flex-col items-center justify-center">
					<div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Depth</div>
					<div class="text-2xl font-mono font-semibold text-gray-900 dark:text-white">{props.state.depth}</div>
				</div>
			</div>
		</div>
	)
}

export default StateSummary
