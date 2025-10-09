import type { Logger } from '@tevm/logger'
import type { Solc } from '@tevm/solc'
import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { WhatsabiBaseOptions } from './whatsabi/WhatsabiBaseOptions.js'

export interface CreateCompilerOptions extends Omit<CompileBaseOptions, 'solcVersion'>, WhatsabiBaseOptions {
	solc?: Solc
	logger?: Logger
}
