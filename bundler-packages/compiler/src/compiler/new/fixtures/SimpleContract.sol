// SPDX-License-Identifier: MIT
pragma solidity >0.8.16;

/// @title BaseContract
/// @notice A base contract with basic storage functionality
contract BaseContract {
	uint256 public value;

	event ValueSet(uint256 newValue);

	/// @notice Set a new value
	/// @param newValue The value to set
	function setValue(uint256 newValue) external {
		value = newValue;
		emit ValueSet(newValue);
	}

	/// @notice Get the current value
	/// @return The current value
	function getValue() external view returns (uint256) {
		return value;
	}
}

/// @title SimpleContract
/// @notice A simple contract that extends BaseContract
contract SimpleContract is BaseContract {
	/// @notice Double the current value
	function doubleValue() external {
		value = value * 2;
		emit ValueSet(value);
	}

	/// @notice Reset the value to zero
	function resetValue() external {
		value = 0;
		emit ValueSet(0);
	}
}
