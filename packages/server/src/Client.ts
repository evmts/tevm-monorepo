import type { MemoryClient } from '@tevm/memory-client'

export type Tevm = MemoryClient<any, any>['transport']['tevm']

export type Client = {
	transport: {
		tevm: MemoryClient<any, any>['transport']['tevm']
	}
}
