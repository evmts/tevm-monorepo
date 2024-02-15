import type { MemoryDb } from './MemoryDb.js'
import type { DBObject } from '@ethereumjs/util'

export type CreateMemoryDbFn<
	TKey extends string | number | Uint8Array = Uint8Array,
	TValue extends
		| string
		| Uint8Array
		| Uint8Array
		| string
		| DBObject = Uint8Array,
> = (initialDb?: Map<TKey, TValue>) => MemoryDb<TKey, TValue>
