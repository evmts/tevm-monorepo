import { type FC, useMemo } from 'react'
import { formatUnits } from 'viem'

import { Icons } from '@/components/common/icons'
import TooltipResponsive from '@/components/common/tooltip-responsive'

type CurrencyAmountProps = {
	amount: string | number | bigint
	symbol?: 'ETH' | 'MATIC' | 'USD' | string
	decimals?: number
	icon?: boolean
}

/**
 * @notice A component to display a currency amount with its symbol or icon
 * @param amount The amount to display (full number including decimals)
 * @param symbol The symbol of the currency (default: 'ETH')
 * @param decimals The decimals of the currency (default: 18 for ETH)
 * @param icon Whether to display the icon of the currency (default: true)
 */
const CurrencyAmount: FC<CurrencyAmountProps> = ({ amount = 0, symbol = 'ETH', decimals = 18, icon = true }) => {
	// Format the amount correctly based on the currency
	const formatted = useMemo(() => {
		return symbol === 'USD' ? amount : formatUnits(BigInt(amount), decimals)
	}, [amount, symbol, decimals])

	// Format the displayed amount
	const displayedAmount = useMemo(() => {
		if (symbol === 'USD')
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(Number(formatted))

		return symbol === 'ETH'
			? BigInt(amount) < BigInt(1e13) && BigInt(amount) > BigInt(0) // 0 < amount < 0.00001 ETH
				? '<0.00001'
				: Number.parseFloat(Number(formatted).toFixed(4))
			: symbol === 'MATIC'
				? BigInt(amount) < BigInt(1e11) && BigInt(amount) > BigInt(0) // 0 < amount < 0.0000001 MATIC
					? '<0.0000001'
					: Number.parseFloat(Number(formatted).toFixed(4))
				: Number.parseFloat(Number(formatted).toFixed(4))
	}, [amount, formatted, symbol])

	// Does the currency have an icon?
	const hasIcon = symbol === 'ETH' || symbol === 'MATIC'

	if (symbol === 'USD') return <span>{displayedAmount}</span>
	// Opinionated: don't show the icon anyway if the amount is 0
	if (BigInt(amount) === BigInt(0)) return <span>{displayedAmount}</span>

	return (
		<TooltipResponsive
			trigger={
				<span className="inline-flex items-center gap-1">
					{icon && symbol === 'ETH' ? (
						<Icons.ethereum className="size-4" />
					) : icon && symbol === 'MATIC' ? (
						<Icons.polygon className="mr-2 size-4" />
					) : null}{' '}
					{displayedAmount} {!hasIcon ? symbol : null}
				</span>
			}
			content={`${formatted} ${symbol}`}
			classNameTrigger="w-min whitespace-nowrap"
		/>
	)
}

export default CurrencyAmount
