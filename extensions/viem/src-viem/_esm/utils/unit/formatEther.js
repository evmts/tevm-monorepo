import { etherUnits } from '../../constants/unit.js'
import { formatUnits } from './formatUnits.js'
export function formatEther(wei, unit = 'wei') {
	return formatUnits(wei, etherUnits[unit])
}
//# sourceMappingURL=formatEther.js.map
