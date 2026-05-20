import { numberToHex } from '@tevm/utils'

export const asLightSelector = (blockTag) => {
	if (
		blockTag === undefined ||
		blockTag === 'latest' ||
		blockTag === 'safe' ||
		blockTag === 'finalized' ||
		blockTag === 'earliest'
	) {
		return blockTag === 'earliest' ? 0n : (blockTag ?? 'latest')
	}
	if (blockTag === 'pending') throw new Error('LIGHT_CLIENT_UNSUPPORTED_SELECTOR: pending is not supported for proof-backed reads')
	if (typeof blockTag === 'bigint') return blockTag
	if (typeof blockTag === 'string' && blockTag.startsWith('0x')) {
		// Block hashes are not supported selectors for proof-backed light reads.
		if (blockTag.length === 66) throw new Error('LIGHT_CLIENT_UNSUPPORTED_SELECTOR: block hash selectors are not supported')
		return BigInt(blockTag)
	}
	throw new Error(`LIGHT_CLIENT_UNSUPPORTED_SELECTOR: unsupported selector ${blockTag}`)
}

export const ensureLightReady = (client, method) => {
	if (client.consensus.mode !== 'light-client') return
	if (client.consensus.isReady?.() === false || client.getLightSyncStatus().ready === false) {
		throw new Error(`LIGHT_CLIENT_NOT_READY: ${method} requires a ready light client`)
	}
}

export const getLightProof = async (client, address, storageKeys, selector) => {
	const stateRoot = await client.consensus.resolveStateRoot?.(selector)
	if (!stateRoot) throw new Error('LIGHT_CLIENT_UNSUPPORTED_SELECTOR: selector is outside retained history window')
	const proof = await client.consensus.getProof?.({ address, storageKeys, selector })
	if (!proof) throw new Error('LIGHT_CLIENT_MALFORMED_UPSTREAM_PROOF: missing proof payload')
	if (!proof.balance || !proof.nonce || !proof.codeHash || !proof.storageHash || !Array.isArray(proof.storageProof)) {
		throw new Error('LIGHT_CLIENT_MALFORMED_UPSTREAM_PROOF: malformed proof payload')
	}
	const ok = await client.consensus.verifyRead?.({
		account: address,
		stateRoot,
		selector: typeof selector === 'bigint' ? numberToHex(selector) : selector,
		proof,
	})
	if (ok === false) throw new Error('LIGHT_CLIENT_PROOF_VERIFICATION_FAILED: proof verification failed')
	return { proof, stateRoot }
}
