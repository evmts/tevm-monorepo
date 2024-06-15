import { EthjsAddress, getAddress } from '@tevm/utils'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * @internal
 * Creates a script with a randomly generated address
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/utils').Hex} deployedBytecode
 * @param {import('@tevm/utils').Address} [to]
 */
export const createScript = async (client, deployedBytecode, to) => {
	const scriptAddress =
		to ??
		(() => {
			const randomBigInt = BigInt(Math.floor(Math.random() * 1_000_000_000_000_000))
			return getAddress(
				EthjsAddress.generate(EthjsAddress.fromString(`0x${'6969'.repeat(10)}`), randomBigInt).toString(),
			)
		})()
	client.logger.debug({ address: scriptAddress }, 'Deploying script to randomly generated address')
	const res = await setAccountHandler(client)({
		deployedBytecode,
		throwOnFail: false,
		address: scriptAddress,
	})
	return {
		scriptAddress,
		errors: res.errors,
	}
}
