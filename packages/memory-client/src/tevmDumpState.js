import { dumpStateHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmDumpState action for viem.
 * Dumps the state of TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').AnvilDumpStateParams} client
 * @returns {Promise<import('@tevm/actions').DumpStateResult>} The dump of the TEVM state.
 */
export const tevmDumpState = async (client) => {
	return dumpStateHandler(client.transport.tevm)()
}
