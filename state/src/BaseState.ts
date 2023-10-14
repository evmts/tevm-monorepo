import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface BaseStateOptions {
	persist: { name: string; version: number } | undefined
}

const identityFn = <T>(thing: T) => thing

/**
 * To protect against stale state we never want to acces
 * state with this.someProp but instead want to always
 * use this.get() to get the state
 */
const VALID_KEYS = new Set(['get', 'set', 'createStore'])
/**
 * The base class that other pieces of state extend from
 * I made this class based because it reduces the boilerplate
 * of using zustand with typescript a fair amount
 *
 * @see https://docs.pmnd.rs/zustand
 */
export abstract class BaseState<T extends {}> {
	/**
	 * Get latest zustand state
	 */
	protected get!: () => T

	/**
	 * Set zustand state.   Zustand will automatically
	 * persist the other keys in the state.
	 *
	 * @see https://docs.pmnd.rs/zustand/guides/updating-state
	 */
	protected set!: (
		stateTransition: Partial<T> | ((state: T) => Partial<T>),
	) => void

	constructor(
		private readonly _options: BaseStateOptions = { persist: undefined },
	) {
		// We never want to this.accessProperty
		// We want to always get() first to get latest zustand state
		// rome-ignore lint/correctness/noConstructorReturn: <explanation>
		return new Proxy(this, {
			get(target, prop) {
				if (!VALID_KEYS.has(prop as string)) {
					throw new Error(
						`Access state with this.get().${String(
							prop,
						)} rather than this.${String(prop)}`,
					)
				}
				return (target as any)[prop]
			},
		})
	}

	/**
	 * @parameter enableDev
	 * @returns zustand store
	 */
	createStore = (enableDev = false) => {
		/**
		 * @see https://docs.pmnd.rs/zustand/integrations/persisting-store-data
		 */
		const persistMiddleware = (
			this._options.persist ? persist : identityFn
		) as typeof persist
		if (enableDev) {
			return create<T>(
				devtools(
					persistMiddleware((set, get) => {
						this.set = set
						this.get = get as () => T
						return { ...this }
						// rome-ignore lint/style/noNonNullAssertion: <explanation>
					}, this._options.persist!) as any,
				) as any,
			)
		}
		/**
		 * @see https://docs.pmnd.rs/zustand/getting-started/introduction#first-create-a-store
		 */
		return create<T>(
			persistMiddleware<T>((set, get) => {
				this.set = set
				this.get = get
				return this as unknown as T
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
			}, this._options.persist!) as any,
		)
	}
}
