import { Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { EvmState } from './types'
import { getEvmState } from './utils'

import BytecodeLoader from './BytecodeLoader'
import Controls from './Controls'
import CopyToast from './CopyToast'
import ErrorAlert from './ErrorAlert'
import Header from './Header'
import LogsAndReturn from './LogsAndReturn'
import Memory from './Memory'
import Stack from './Stack'
import StateSummary from './StateSummary'
import Storage from './Storage'

const EvmDebugger = () => {
	const [bytecode, setBytecode] = createSignal('0x')
	const [state, setState] = createSignal<EvmState>({
		pc: 0,
		opcode: '-',
		gasLeft: 0,
		depth: 0,
		stack: [],
		memory: '0x',
		storage: {},
		logs: [],
		returnData: '0x',
	})
	const [isRunning, setIsRunning] = createSignal(false)
	const [error, setError] = createSignal('')
	const [copied, setCopied] = createSignal('')
	const [isUpdating, setIsUpdating] = createSignal(false)
	const [isDarkMode, setIsDarkMode] = createSignal(false)
	const [showSample, setShowSample] = createSignal(false)
	const [activePanel, setActivePanel] = createSignal('all')

	onMount(() => {
		if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
			setIsDarkMode(true)
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			setIsDarkMode(event.matches)
		})
	})

	createEffect(() => {
		if (!isRunning()) return
		const refreshState = async () => {
			try {
				const freshState = await getEvmState()
				setState(freshState)
			} catch (err) {
				setError(`Failed to get state: ${err}`)
			}
		}

		const interval = setInterval(refreshState, 100)

		onCleanup(() => {
			clearInterval(interval)
		})
	})

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
			return
		}

		if (e.key === 'r' || e.key === 'R') {
			const handleResetEvm = async () => {
				try {
					setError('')
					setIsRunning(false)
				} catch (err) {
					setError(`${err}`)
				}
			}

			handleResetEvm()
		} else if (e.key === 's' || e.key === 'S') {
			const handleStepEvm = async () => {
				try {
					setError('')
					setIsUpdating(true)
				} catch (err) {
					setError(`${err}`)
					setIsUpdating(false)
				}
			}

			handleStepEvm()
		} else if (e.key === ' ') {
			e.preventDefault()
			const handleToggleRunPause = async () => {
				try {
					setError('')
					setIsRunning(!isRunning())
				} catch (err) {
					setError(`${err}`)
					setIsRunning(false)
				}
			}

			handleToggleRunPause()
		} else if (e.key === 'd' && e.ctrlKey) {
			e.preventDefault()
			setIsDarkMode(!isDarkMode())
		}
	}

	createEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		onCleanup(() => {
			window.removeEventListener('keydown', handleKeyDown)
		})
	})

	return (
		<div class={`min-h-screen transition-colors duration-300 ${isDarkMode() ? 'dark' : ''}`}>
			<div class="bg-white dark:bg-[#1E1E1E] min-h-screen text-gray-900 dark:text-gray-100">
				<Header
					showSample={showSample()}
					setShowSample={setShowSample}
					isDarkMode={isDarkMode()}
					setIsDarkMode={setIsDarkMode}
					setBytecode={setBytecode}
					activePanel={activePanel()}
					setActivePanel={setActivePanel}
				/>
				<div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
					<ErrorAlert error={error()} setError={setError} />
					<BytecodeLoader
						bytecode={bytecode()}
						setBytecode={setBytecode}
						setError={setError}
						setIsRunning={setIsRunning}
						setState={setState}
					/>
					<Controls
						isRunning={isRunning()}
						setIsRunning={setIsRunning}
						setError={setError}
						setState={setState}
						isUpdating={isUpdating()}
						setIsUpdating={setIsUpdating}
					/>
					<StateSummary state={state()} isUpdating={isUpdating()} />
					<div class="grid gap-6 grid-cols-1 lg:grid-cols-2">
						<Show when={activePanel() === 'all' || activePanel() === 'stack'}>
							<Stack state={state()} copied={copied()} setCopied={setCopied} />
						</Show>
						<Show when={activePanel() === 'all' || activePanel() === 'memory'}>
							<Memory state={state()} copied={copied()} setCopied={setCopied} />
						</Show>
						<Show when={activePanel() === 'all' || activePanel() === 'storage'}>
							<Storage state={state()} copied={copied()} setCopied={setCopied} />
						</Show>
						<Show when={activePanel() === 'all' || activePanel() === 'logs'}>
							<LogsAndReturn state={state()} copied={copied()} setCopied={setCopied} />
						</Show>
					</div>
				</div>
				<CopyToast copied={copied()} />
			</div>
		</div>
	)
}

export default EvmDebugger
