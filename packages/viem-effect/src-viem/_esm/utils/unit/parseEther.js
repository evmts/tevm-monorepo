import { etherUnits } from '../../constants/unit.js'
import { parseUnits } from './parseUnits.js'
export function parseEther(ether, unit = 'wei') {
	return parseUnits(ether, etherUnits[unit])
}
//# sourceMappingURL=parseEther.js.map
