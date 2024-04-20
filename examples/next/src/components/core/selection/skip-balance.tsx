'use client'

import { Icons } from '@/components/common/icons'
import TooltipResponsive from '@/components/common/tooltip-responsive'
import { Toggle } from '@/components/ui/toggle'
import { useConfigStore } from '@/lib/store/use-config'

/**
 * @notice Choose whether to skip native balance checks during Tevm calls
 * @dev This is enabled by default and can be toggled off
 */
const SkipBalanceCheck = () => {
	/* ---------------------------------- STATE --------------------------------- */
	const { skipBalance, setSkipBalance } = useConfigStore((state) => ({
		skipBalance: state.skipBalance,
		setSkipBalance: state.setSkipBalance,
	}))

	/* --------------------------------- RENDER --------------------------------- */
	return (
		<div className="col-span-2 flex w-full items-center justify-end gap-2 whitespace-nowrap">
			<Toggle
				size="sm"
				className="flex items-center gap-1 text-xs"
				aria-label="Skip balance check"
				pressed={skipBalance}
				onPressedChange={setSkipBalance}
			>
				{skipBalance ? <Icons.check className="size-4" /> : <Icons.close className="size-4" />}
				<span>skip balance</span>
			</Toggle>
			<TooltipResponsive trigger="info" content="Whether to ignore native balance checks during calls" />
		</div>
	)
}

export default SkipBalanceCheck
