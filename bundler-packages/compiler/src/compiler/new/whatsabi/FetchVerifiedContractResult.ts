import type { CompiledSourceContractOutput } from './CompiledSourceContractOutput.js'

// TODO: make whatsabi output the same api as compile functions
// TODO: here we might want to get the same ast object with useful methods as the compiler api
export interface FetchVerifiedContractResult {
	contractOutput: CompiledSourceContractOutput
}
