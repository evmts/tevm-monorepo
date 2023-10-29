import {} from '../../types/chain.js'
import { hexToBigInt } from '../../utils/encoding/fromHex.js'
import { numberToHex } from '../../utils/encoding/toHex.js'
import { defineBlock } from '../../utils/formatters/block.js'
import {
	defineTransaction,
	formatTransaction,
} from '../../utils/formatters/transaction.js'
import { defineTransactionReceipt } from '../../utils/formatters/transactionReceipt.js'
import { defineTransactionRequest } from '../../utils/formatters/transactionRequest.js'
export const formattersCelo = {
	block: /*#__PURE__*/ defineBlock({
		exclude: ['difficulty', 'gasLimit', 'mixHash', 'nonce', 'uncles'],
		format(args) {
			const transactions = args.transactions?.map((transaction) => {
				if (typeof transaction === 'string') return transaction
				return {
					...formatTransaction(transaction),
					feeCurrency: transaction.feeCurrency,
					gatewayFee: transaction.gatewayFee
						? hexToBigInt(transaction.gatewayFee)
						: null,
					gatewayFeeRecipient: transaction.gatewayFeeRecipient,
				}
			})
			return {
				randomness: args.randomness,
				transactions,
			}
		},
	}),
	transaction: /*#__PURE__*/ defineTransaction({
		format(args) {
			return {
				feeCurrency: args.feeCurrency,
				gatewayFee: args.gatewayFee ? hexToBigInt(args.gatewayFee) : null,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
		},
	}),
	transactionReceipt: /*#__PURE__*/ defineTransactionReceipt({
		format(args) {
			return {
				feeCurrency: args.feeCurrency,
				gatewayFee: args.gatewayFee ? hexToBigInt(args.gatewayFee) : null,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
		},
	}),
	transactionRequest: /*#__PURE__*/ defineTransactionRequest({
		format(args) {
			const request = {
				feeCurrency: args.feeCurrency,
				gatewayFee:
					typeof args.gatewayFee !== 'undefined'
						? numberToHex(args.gatewayFee)
						: undefined,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
			if (args.type === 'cip42') request.type = '0x7c'
			return request
		},
	}),
}
//# sourceMappingURL=formatters.js.map
