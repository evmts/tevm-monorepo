import type { CompileBaseOptions } from '../compiler/CompileBaseOptions.js'

// TODO: this and all these types are in whatsabi directly
export interface WhatsabiBaseOptions extends CompileBaseOptions {
	chainId?: number
	// followProxies, loaders api keys, etc
}
