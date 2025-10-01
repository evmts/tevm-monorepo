import { createTevmTransport, tevmViemActions } from 'tevm'
import { optimism } from 'tevm/common'
import { createClient, http, publicActions, testActions, walletActions } from 'viem'

/**
####  #####  ######   ##   ##### # #    #  ####       ##       ####  #      # ###### #    # ##### 
#    # #    # #       #  #    #   # ##   # #    #     #  #     #    # #      # #      ##   #   #   
#      #    # #####  #    #   #   # # #  # #         #    #    #      #      # #####  # #  #   #   
#      #####  #      ######   #   # #  # # #  ###    ######    #      #      # #      #  # #   #   
#    # #   #  #      #    #   #   # #   ## #    #    #    #    #    # #      # #      #   ##   #   
####  #    # ###### #    #   #   # #    #  ####     #    #     ####  ###### # ###### #    #   #   
*/

/**
 * Create a client with viem using tevm as transport
 */
const client = createClient({
	transport: createTevmTransport({ fork: { transport: http('https://mainnet.optimism.io')({}) } }),
	chain: optimism,
})

/**
 
#    #  ####  # #    #  ####      ####  #      # ###### #    # #####    #       ####  #    #    #      ###### #    # ###### #           ##   #####  # 
#    # #      # ##   # #    #    #    # #      # #      ##   #   #      #      #    # #    #    #      #      #    # #      #          #  #  #    # # 
#    #  ####  # # #  # #         #      #      # #####  # #  #   #      #      #    # #    #    #      #####  #    # #####  #         #    # #    # # 
#    #      # # #  # # #  ###    #      #      # #      #  # #   #      #      #    # # ## #    #      #      #    # #      #         ###### #####  # 
#    # #    # # #   ## #    #    #    # #      # #      #   ##   #      #      #    # ##  ##    #      #       #  #  #      #         #    # #      # 
####   ####  # #    #  ####      ####  ###### # ###### #    #   #      ######  ####  #    #    ###### ######   ##   ###### ######    #    # #      # 
 
*/

// with a vanilla client you can make a request
client.request({ method: 'eth_chainId' }).then(console.log)
// you can make a tevm specific json rpc request
client.transport
	.request({ method: 'tevm_setAccount', params: [{ address: `0x${'69'.repeat(20)}`, balance: '0xffffffffff' }] })
	.then(console.log)
// and you have access to the low level tevm vm, mempool and more
// You can use the vm to low level run a tx or block and more
const vm = await client.transport.tevm.getVm()
vm.deepCopy
vm.runBlock
vm.buildBlock
// tree shakeable actions exist too like `runTx(vm, ....)`

// the blockchain gives low level access to blockchain
const { blockchain } = vm
blockchain.deepCopy
blockchain.getBlock
blockchain.putBlock
blockchain.delBlock
blockchain.getCanonicalHeadBlock
blockchain.blocksByTag
blockchain.consensus
blockchain.validateHeader

// stateeManager gives low level access to state
const { stateManager } = vm
stateManager.deepCopy
stateManager.setStateRoot
stateManager.getAccount
stateManager.putAccount
stateManager.dumpStorageRange

// evm gives access to the pure evm interpreter
const { evm } = vm
evm.runCall({ data: new Uint8Array() }).then(console.log)

// mempool gives access to the unmined tx
const mempool = await client.transport.tevm.getTxPool()
mempool.add
mempool.addUnverified
mempool.getByHash
mempool.removeByHash
mempool.getBySenderAddress
mempool.txsByPriceAndNonce

// receiptManager is where receipt information is cached
const receiptManager = await client.transport.tevm.getReceiptsManager()
receiptManager.getLogs
receiptManager.saveReceipts
receiptManager.getReceipts
receiptManager.getReceiptByTxHash

/*
#######                                                                                          
#       #    # ##### ###### #    # #####  # #    #  ####      ####  #      # ###### #    # ##### 
#        #  #    #   #      ##   # #    # # ##   # #    #    #    # #      # #      ##   #   #   
#####     ##     #   #####  # #  # #    # # # #  # #         #      #      # #####  # #  #   #   
#         ##     #   #      #  # # #    # # #  # # #  ###    #      #      # #      #  # #   #   
#        #  #    #   #      #   ## #    # # #   ## #    #    #    # #      # #      #   ##   #   
####### #    #   #   ###### #    # #####  # #    #  ####      ####  ###### # ###### #    #   #   
 
*/

// You could extend the client with additional actions from viem and tevm
const extendedClient = client
	.extend(tevmViemActions())
	.extend(publicActions)
	.extend(walletActions)
	.extend(testActions({ mode: 'anvil' }))

// if you want 'batteries included' client createMemoryClient is available and comes preloaded with all actions like above extendedClient
// Note: for UI apps you should use tree shakeable actions
import { createMemoryClient } from 'tevm'

const _memoryClient = createMemoryClient({ fork: { transport: http('https://mainnet.optimism.io')({}) } })
// custom tevm actions
extendedClient.tevmSetAccount
extendedClient.tevmCall
extendedClient.tevmMine
// viem public actions
extendedClient.getChainId
extendedClient.readContract
extendedClient.estimateGas
// viem wallet actions
extendedClient.sendTransaction
extendedClient.writeContract
// viem test actions
extendedClient.setCode
extendedClient.setBalance

/*
#######                                                                                                                               
#    #####  ###### ######     ####  #    #   ##   #    #   ##   #####  #      ######      ##    ####  ##### #  ####  #    #  ####  
#    #    # #      #         #      #    #  #  #  #   #   #  #  #    # #      #          #  #  #    #   #   # #    # ##   # #      
#    #    # #####  #####      ####  ###### #    # ####   #    # #####  #      #####     #    # #        #   # #    # # #  #  ####  
#    #####  #      #              # #    # ###### #  #   ###### #    # #      #         ###### #        #   # #    # #  # #      # 
#    #   #  #      #         #    # #    # #    # #   #  #    # #    # #      #         #    # #    #   #   # #    # #   ## #    # 
#    #    # ###### ######     ####  #    # #    # #    # #    # #####  ###### ######    #    #  ####    #   #  ####  #    #  ####  
 
*/

// If tree shaking is relevant because you are building a frontend app you should use tree shakeable actions
import { getChainId } from 'viem/actions'

// same as extendedClient.getChainId()
getChainId(client).then(console.log)

// If doing a wallet action you can use one of the prefunded wallet accounts
import { PREFUNDED_ACCOUNTS } from 'tevm'
import { sendTransaction } from 'viem/actions'

sendTransaction(client, {
	account: PREFUNDED_ACCOUNTS[0],
	to: `0x${'69'.repeat(20)}`,
	value: BigInt(0xffffffffff),
}).then(console.log)

// Tevm specific actions are also available
import { tevmSetAccount } from 'tevm'

tevmSetAccount(client, { address: `0x${'69'.repeat(20)}`, balance: '0xffffffffff' }).then(console.log)
