import { bytesToHex, toHex } from '@tevm/utils'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'

// TODO only works in forked mode
/**
 * Get an EIP-1186 proof from the provider
 * @type {import("../state-types/index.js").StateAction<'getProof'>}
 */
export const getProof =
	(baseState) =>
	async (address, storageSlots = []) => {
		if (!baseState.options.fork?.transport) {
			throw new Error('getProof only implemented in fork mode atm')
		}
		const client = getForkClient(baseState)
		const blockTag = getForkBlockTag(baseState)
		const proof = await client.getProof({
			address: /** @type {import('@tevm/utils').Address}*/ (address.toString()),
			storageKeys: storageSlots.map((slot) => bytesToHex(slot)),
			...blockTag,
		})
		return {
			address: proof.address,
			accountProof: proof.accountProof,
			balance: toHex(proof.balance),
			codeHash: proof.codeHash,
			nonce: toHex(proof.nonce),
			storageHash: proof.storageHash,
			storageProof: proof.storageProof.map((p) => ({
				proof: p.proof,
				value: toHex(p.value),
				key: p.key,
			})),
		}
	}
