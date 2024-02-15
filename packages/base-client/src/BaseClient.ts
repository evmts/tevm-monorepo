import type { TevmVm } from '@tevm/vm'

/**
 * The base client used by Tevm. Add extensions to add additional functionality
 */
export type BaseClient<
	TMode extends 'fork' | 'proxy' | 'normal' = 'fork' | 'proxy' | 'normal',
	TExtended = {},
> = {
	/**
	 * Gets the chainId of the current EVM
	 */
	readonly chainId: number
	/**
	 * Fork url if the EVM is forked
	 */
	readonly forkUrl?: string | undefined
	/**
	 * The mode the current client is running in
	 * `fork` mode will fetch and cache all state from the block forked from the provided URL
	 * `proxy` mode will fetch all state from the latest block of the provided proxy URL
	 * `normal` mode will not fetch any state and will only run the EVM in memory
	 */
	readonly mode: TMode
	/**
	 * Internal instance of the VM. Can be used for lower level operations
	 */
	readonly vm: TevmVm
	/**
	 * Extends the base client with additional functionality
	 */
	readonly extend: <TExtension extends Record<string, any>>(
		decorator: (client: BaseClient<TMode, TExtended>) => TExtension,
	) => BaseClient<TMode, TExtended & TExtension>
} & TExtended
