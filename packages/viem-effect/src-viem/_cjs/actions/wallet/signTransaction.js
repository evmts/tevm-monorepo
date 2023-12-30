'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.signTransaction = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const account_js_1 = require('../../errors/account.js')
const chain_js_1 = require('../../utils/chain.js')
const transactionRequest_js_1 = require('../../utils/formatters/transactionRequest.js')
const index_js_1 = require('../../utils/index.js')
const assertRequest_js_1 = require('../../utils/transaction/assertRequest.js')
const getChainId_js_1 = require('../public/getChainId.js')
async function signTransaction(client, args) {
	const {
		account: account_ = client.account,
		chain = client.chain,
		...transaction
	} = args
	if (!account_)
		throw new account_js_1.AccountNotFoundError({
			docsPath: '/docs/actions/wallet/signTransaction',
		})
	const account = (0, parseAccount_js_1.parseAccount)(account_)
	;(0, assertRequest_js_1.assertRequest)({
		account,
		...args,
	})
	const chainId = await (0, getChainId_js_1.getChainId)(client)
	if (chain !== null)
		(0, chain_js_1.assertCurrentChain)({
			currentChainId: chainId,
			chain,
		})
	const formatters = chain?.formatters || client.chain?.formatters
	const format =
		formatters?.transactionRequest?.format ||
		transactionRequest_js_1.formatTransactionRequest
	if (account.type === 'local')
		return account.signTransaction(
			{
				chainId,
				...transaction,
			},
			{ serializer: client.chain?.serializers?.transaction },
		)
	return await client.request({
		method: 'eth_signTransaction',
		params: [
			{
				...format(transaction),
				chainId: (0, index_js_1.numberToHex)(chainId),
				from: account.address,
			},
		],
	})
}
exports.signTransaction = signTransaction
//# sourceMappingURL=signTransaction.js.map
