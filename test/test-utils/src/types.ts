// This file contains type definitions to avoid circular dependencies

// We define these types locally to avoid importing from @tevm/node and @tevm/utils
export interface TevmNodeBasic {
	ready: () => Promise<void>
	getVm: () => Promise<any>
	setAccount: (params: any) => Promise<void>
	tevmSetStorageAt: (params: any) => Promise<void>
	sendTransaction: (params: any) => Promise<any>
	mine: (params: any) => Promise<void>
}

export type PrefundedAccount = {
	address: string
	privateKey: string
}

// Just define the structure we need without importing
export type CreateTevmNodeFn = (options: any) => TevmNodeBasic
