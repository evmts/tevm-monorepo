import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { WhatsabiBaseOptions } from './whatsabi/WhatsabiBaseOptions.js'

export interface CreateCompilerOptions extends CompileBaseOptions, WhatsabiBaseOptions {}
