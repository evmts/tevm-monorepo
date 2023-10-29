import { gweiUnits } from '../../constants/unit.js'
import { formatUnits } from './formatUnits.js'
export function formatGwei(wei, unit = 'wei') {
	return formatUnits(wei, gweiUnits[unit])
}
//# sourceMappingURL=formatGwei.js.map
