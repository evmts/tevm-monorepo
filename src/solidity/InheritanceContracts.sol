// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Inheritance and Interface Test Contracts
 * @dev Collection of contracts for testing inheritance patterns, virtual functions,
 *      interfaces, and polymorphism in the EVM environment
 */

// Base interface for testing interface compliance
interface IBaseInterface {
    function getValue() external view returns (uint256);
    function setValue(uint256 value) external;
}

// Extended interface for testing interface inheritance
interface IExtendedInterface is IBaseInterface {
    function getDoubledValue() external view returns (uint256);
}

// Abstract base contract with virtual functions
abstract contract BaseContract {
    uint256 internal baseValue;
    
    constructor(uint256 _initialValue) {
        baseValue = _initialValue;
    }
    
    // Virtual function to be overridden
    function getValue() public view virtual returns (uint256) {
        return baseValue;
    }
    
    // Virtual function with implementation
    function increment() public virtual {
        baseValue++;
    }
    
    // Abstract function must be implemented by children
    function getType() public pure virtual returns (string memory);
}

// Concrete implementation of base contract
contract ConcreteA is BaseContract, IExtendedInterface {
    uint256 private multiplier;
    
    constructor(uint256 _initialValue, uint256 _multiplier) 
        BaseContract(_initialValue) {
        multiplier = _multiplier;
    }
    
    // Override virtual function
    function getValue() public view override returns (uint256) {
        return baseValue * multiplier;
    }
    
    // Implement interface function
    function setValue(uint256 value) external override {
        baseValue = value;
    }
    
    // Implement extended interface function
    function getDoubledValue() external view override returns (uint256) {
        return getValue() * 2;
    }
    
    // Override increment with custom logic
    function increment() public override {
        baseValue += multiplier;
    }
    
    // Implement abstract function
    function getType() public pure override returns (string memory) {
        return "ConcreteA";
    }
}

// Second concrete implementation with different behavior
contract ConcreteB is BaseContract, IBaseInterface {
    uint256 private bonus;
    
    constructor(uint256 _initialValue, uint256 _bonus) 
        BaseContract(_initialValue) {
        bonus = _bonus;
    }
    
    // Override virtual function with different implementation
    function getValue() public view override returns (uint256) {
        return baseValue + bonus;
    }
    
    // Implement interface function
    function setValue(uint256 value) external override {
        baseValue = value;
        bonus = value / 10; // 10% bonus
    }
    
    // Implement abstract function
    function getType() public pure override returns (string memory) {
        return "ConcreteB";
    }
}

// Diamond inheritance pattern (multiple inheritance)
contract LeftBase {
    uint256 public leftValue = 100;
    
    function getLeftValue() public view virtual returns (uint256) {
        return leftValue;
    }
}

contract RightBase {
    uint256 public rightValue = 200;
    
    function getRightValue() public view virtual returns (uint256) {
        return rightValue;
    }
}

contract Diamond is LeftBase, RightBase {
    function getCombinedValue() public view returns (uint256) {
        return getLeftValue() + getRightValue();
    }
    
    // Override both inherited functions
    function getLeftValue() public view override returns (uint256) {
        return leftValue * 2;
    }
    
    function getRightValue() public view override returns (uint256) {
        return rightValue * 3;
    }
}

// Contract for testing super calls
contract Parent {
    uint256 public value;
    
    constructor(uint256 _value) {
        value = _value;
    }
    
    function process() public virtual returns (uint256) {
        value += 10;
        return value;
    }
}

contract Child is Parent {
    constructor(uint256 _value) Parent(_value) {}
    
    function process() public override returns (uint256) {
        // Call parent implementation first
        uint256 parentResult = super.process();
        // Add child-specific logic
        value += 5;
        return parentResult + value;
    }
}

// Testing function overloading and visibility
contract VisibilityTester {
    uint256 private privateVar = 1;
    uint256 internal internalVar = 2;
    uint256 public publicVar = 3;
    
    // Internal function
    function internalFunction() internal pure returns (uint256) {
        return 100;
    }
    
    // Public function that calls internal
    function callInternal() public pure returns (uint256) {
        return internalFunction();
    }
    
    // Function overloading
    function setValue(uint256 value) public {
        publicVar = value;
    }
    
    function setValue(uint256 value, bool double) public {
        if (double) {
            publicVar = value * 2;
        } else {
            publicVar = value;
        }
    }
    
    // Getter for private variable
    function getPrivateVar() public view returns (uint256) {
        return privateVar;
    }
}

// Testing modifier inheritance
contract ModifierBase {
    address public owner;
    bool public paused = false;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() virtual {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() virtual {
        require(!paused, "Paused");
        _;
    }
    
    function pause() public onlyOwner {
        paused = true;
    }
    
    function unpause() public onlyOwner {
        paused = false;
    }
}

contract ModifierChild is ModifierBase {
    uint256 public counter;
    
    // Override modifier with additional logic
    modifier onlyOwner() override {
        require(msg.sender == owner, "Not owner");
        require(counter < 100, "Counter limit reached");
        _;
    }
    
    function increment() public onlyOwner whenNotPaused {
        counter++;
    }
    
    function reset() public onlyOwner {
        counter = 0;
    }
}