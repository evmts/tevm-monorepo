/**
 * Options for a HttpClient
 */
export type HttpClientOptions = {
	/**
	 * Remote URL to connect to
	 */
	readonly url: string
	/**
	 * Optional name for the client
	 */
	readonly name?: string
}
