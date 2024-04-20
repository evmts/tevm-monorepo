import type { State } from './State.js'
import { basename } from 'path'

/**
 * State transition functions the UI can call
 */
export type Reducer<TPayload> = (payload: TPayload, state: State) => State

/**
 * Mapping of available state transition functions
 */
export type Reducers = typeof reducers

/**
 * Sets the name input when user types
 */
const setInput: Reducer<{
	value: string
	input: 'chainIdInput' | 'nameInput' | 'walletConnectIdInput'
}> = (payload, state) => {
	return { ...state, [payload.input]: payload.value }
}

/**
 * Selects an option and continues to the next step
 */
const selectAndContinue = (<TName extends keyof State>(
	payload: { name: TName; value: State[TName]; nextPage?: boolean },
	state: State,
) => {
	const newState: State = {
		...state,
		[payload.name]: payload.value,
		currentStep: payload.nextPage ? state.currentStep : state.currentStep + 1,
		currentPage: payload.nextPage
			? goToNextPage({}, state).currentPage
			: state.currentPage,
	}

	const isName = payload.name === 'name'
	const isFrameworkBun =
		payload.name === 'framework' && (payload.value as string).includes('bun')
	const isFrameworkMud =
		payload.name === 'framework' && (payload.value as string).includes('mud')
	// if name step is set also set the path if name is a path instead of a name
	if (isName) {
		return {
			...newState,
			path: payload.value as State['path'],
			name: basename(payload.value as State['name']),
		} as const
	} else if (isFrameworkBun) {
		return {
			...newState,
			packageManager: 'bun',
		} as const
	} else if (isFrameworkMud) {
		return {
			...newState,
			packageManager: 'pnpm',
			linter: 'eslint-prettier',
			typescriptStrictness: 'strict',
			testFrameworks: 'none',
			solidityFramework: 'foundry',
			contractStrategy: 'local',
		} as const
	} else {
		return newState
	}
}) satisfies Reducer<{ name: keyof State; value: State[keyof State] }>

const goToPreviousStep: Reducer<any> = (_, state) => {
	if (state.currentStep === 0) {
		return state
	}
	return {
		...state,
		currentStep: state.currentStep - 1,
	}
}

/**
 * Gos to the next page of the prompt
 */
const goToNextPage: Reducer<any> = (_, state) => {
	if (state.currentPage === 'interactive') {
		return {
			...state,
			currentPage: 'creating',
		}
	}
	if (state.currentPage === 'creating') {
		return {
			...state,
			currentPage: 'complete',
		}
	}
	if (state.currentPage === 'complete') {
		throw new Error('Cannot go to next page from complete')
	}
	throw new Error(`Unknown page ${state.currentPage satisfies never}`)
}

/**
 * Available state transition functions
 */
export const reducers = {
	setInput,
	goToNextPage,
	selectAndContinue,
	goToPreviousStep,
}
