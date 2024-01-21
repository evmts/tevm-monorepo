/**
 * Options fetch state that isn't available locally.
 */
export type ForkOptions = {
	/**
	 * The url to fork. This url will be used to fetch state
	 * that isn't available locally. It will also be used to
	 * fulfill JSON-RPC requests that cannot be fulfilled locally
	 */
	url: string
	/**
	 * The block tag to use for the EVM.
	 * If not passed it will start from the latest
	 * block at the time of forking. Defaults to 'latest'
	 */
	blockTag?: bigint
}
