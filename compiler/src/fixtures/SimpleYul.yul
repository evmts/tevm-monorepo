/// @title SimpleYul
/// @notice A simple Yul contract that stores and returns a value
object "SimpleYul" {
	code {
		// Constructor - copy runtime code
		datacopy(0, dataoffset("Runtime"), datasize("Runtime"))
		return(0, datasize("Runtime"))
	}
	object "Runtime" {
		code {
			// Get function selector from calldata
			let selector := shr(224, calldataload(0))

			switch selector
			// setValue(uint256) - selector: 0x55241077
			case 0x55241077 {
				let newValue := calldataload(4)
				sstore(0, newValue)
			}
			// getValue() - selector: 0x20965255
			case 0x20965255 {
				let storedValue := sload(0)
				mstore(0, storedValue)
				return(0, 32)
			}
			// Default case - revert
			default {
				revert(0, 0)
			}
		}
	}
}
