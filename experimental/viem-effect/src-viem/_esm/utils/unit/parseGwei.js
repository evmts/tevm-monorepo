import { gweiUnits } from '../../constants/unit.js'
import { parseUnits } from './parseUnits.js'
export function parseGwei(ether, unit = 'wei') {
	return parseUnits(ether, gweiUnits[unit])
}
//# sourceMappingURL=parseGwei.js.map
