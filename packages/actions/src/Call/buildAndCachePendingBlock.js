/**
* @param {import("@tevm/base-client").BaseClient} client
*/
export const buildAndCachePendingBlock = async (client) => {
const vm = await client.getVm().then(vm => vm.deepCopy())
const txPool = await client.getTxPool()
txPool
const iterations = 0
while ()
}
