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
const setInput: Reducer<{ value: string, input: 'chainIdInput' | 'nameInput' }> = (payload, state) => {
  return { ...state, [payload.input]: payload.value }
}

/**
 * Selects an option and continues to the next step
 */
const selectAndContinue = (<TName extends keyof State>(
  payload: { name: TName, value: State[TName] }, state: State
) => {
  return {
    ...state,
    path: payload.name === 'name' ? payload.value as string : state.path as string,
    [payload.name]: payload.name === 'name' ? basename(payload.value as string) : payload.value,
    currentStep: state.currentStep + 1,
  }
}) satisfies Reducer<{ name: keyof State, value: State[keyof State] }>

/**
 * Available state transition functions
 */
export const reducers = {
  setInput: setInput,
  selectAndContinue
}

