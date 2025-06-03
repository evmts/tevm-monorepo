import { Component, Setter } from 'solid-js'
import { loadBytecode, resetEvm } from './utils'

interface BytecodeLoaderProps {
	bytecode: string
	setBytecode: Setter<string>
	setError: Setter<string>
	setIsRunning: Setter<boolean>
	setState: Setter<any>
}

const BytecodeLoader: Component<BytecodeLoaderProps> = (props) => {
	const handleLoadBytecode = async () => {
		try {
			props.setError('')
			await loadBytecode(props.bytecode)
			props.setIsRunning(false)
			const state = await resetEvm()
			props.setState(state)
		} catch (err) {
			props.setError(`${err}`)
		}
	}

	return (
		<div class="mb-6 bg-white dark:bg-[#252525] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
			<div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-between">
				<div>
					<h2 class="text-base font-medium text-gray-900 dark:text-white">Bytecode</h2>
					<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
						Enter EVM bytecode to debug or select a sample contract
					</p>
				</div>
				<button
					type="button"
					onClick={handleLoadBytecode}
					class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 text-white rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 flex items-center transform hover:translate-y-[-1px] active:translate-y-[1px]"
					aria-label="Load bytecode"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-2"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-label="Load icon"
					>
						<title>Load icon</title>
						<path d="m5 12 5 5 9-9" />
					</svg>
					Load Bytecode
				</button>
			</div>
			<div class="p-4">
				<textarea
					id="bytecode"
					value={props.bytecode}
					onInput={(e) => props.setBytecode(e.target.value)}
					class="w-full h-24 font-mono text-sm bg-white dark:bg-[#2D2D2D] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-inner"
					placeholder="0x608060405234801561001057600080fd5b50..."
					aria-label="EVM bytecode input"
				/>
			</div>
		</div>
	)
}

export default BytecodeLoader
