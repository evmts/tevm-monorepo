// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { concatBytes, hexToBytes, numberToHex } from '@tevm/utils'

import type { Common } from '@tevm/common'
import type { AbstractLevel } from 'abstract-level'
import type { Chain } from './Chain.js'

const encodingOpts = { keyEncoding: 'view', valueEncoding: 'view' }

/**
 * Number prepended to the db key to avoid collisions
 * when using the meta db for different data.
 *
 * Only append new items to the bottom of the list to
 * remain backward compat.
 */
export enum DBKey {
	Receipts = 0,
	TxHash = 1,
	SkeletonBlock = 2,
	SkeletonBlockHashToNumber = 3,
	SkeletonStatus = 4,
	SkeletonUnfinalizedBlockByHash = 5,
	Preimage = 6,
}

export interface MetaDBManagerOptions {
	common: Common
	/* Chain */
	chain: Chain

	/* Meta database (receipts, logs, indexes) */
	metaDB: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
}

/**
 * Helper class to access the metaDB with methods `put`, `get`, and `delete`
 */
export class MetaDBManager {
	protected chain: Chain
	protected common: Common
	private metaDB: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

	constructor(options: MetaDBManagerOptions) {
		this.chain = options.chain
		this.common = options.common
		this.metaDB = options.metaDB
	}

	private dbKey(type: DBKey, key: Uint8Array) {
		// TODO add numberToBytes to utils
		return concatBytes(hexToBytes(numberToHex(type)), key)
	}

	async put(type: DBKey, hash: Uint8Array, value: Uint8Array) {
		await this.metaDB.put(this.dbKey(type, hash), value, encodingOpts)
	}

	async get(type: DBKey, hash: Uint8Array): Promise<Uint8Array | null> {
		try {
			return await this.metaDB.get(this.dbKey(type, hash), encodingOpts)
		} catch (error: any) {
			if (error.code === 'LEVEL_NOT_FOUND') {
				return null
			}
			throw Error
		}
	}

	async delete(type: DBKey, hash: Uint8Array) {
		await this.metaDB.del(this.dbKey(type, hash), encodingOpts)
	}
}
