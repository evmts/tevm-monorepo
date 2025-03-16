# TEVM CLI

Command-line interface for interacting with the Ethereum Virtual Machine.

## Installation

```bash
npm install -g @tevm/cli
```

## Usage

The TEVM CLI provides several commands for interacting with the Ethereum Virtual Machine:

### Call a Contract

```bash
tevm call <address> [options]
```

### Execute a Contract Function

```bash
tevm contract <address> <functionName> --abi=<abiPath> [options]
```

### Create a New Project

```bash
tevm create [name] [options]
```

## Interactive Mode

TEVM CLI supports an interactive mode that lets you edit command parameters in your preferred text editor before execution. This is useful for complex commands that require a lot of parameters.

To use interactive mode, add the `--interactive` or `-i` flag to your command:

```bash
tevm call 0x123... --interactive
```

This will:

1. Open a temporary file in your editor (uses $EDITOR, $VISUAL environment variables, or defaults to vim)
2. Show all current parameters as a JSON object
3. Allow you to edit the parameters
4. Execute the command with your edited parameters when you save and close the editor

### Interactive Contract Calls

When using interactive mode with the `contract` command, you can edit function arguments directly in JSON format:

```bash
tevm contract 0x123 myFunction --abi=./abi.json --interactive
```

The editor will show:

```json
{
  "rpc": "http://localhost:8545",
  "abi": "./abi.json",
  "to": "0x123",
  "functionName": "myFunction",
  "arguments": [] // You can edit this array with your function arguments
}
```

## Environment Variables

All CLI options can be set via environment variables with the `TEVM_` prefix:

```bash
# Set the RPC endpoint
export TEVM_RPC=https://mainnet.infura.io/v3/your-key

# Run in interactive mode by default
export TEVM_INTERACTIVE=true

# Use a specific template for creation
export TEVM_TEMPLATE=hardhat
```

## Available Options

For a complete list of options, use the `--help` flag with any command:

```bash
tevm call --help
tevm contract --help
tevm create --help
```

## Commands

### call

Make a low-level call to an Ethereum contract.

```bash
# Basic usage
tevm call 0x1234567890123456789012345678901234567890 \
  --data 0x1234abcd

# With gas and value parameters
tevm call 0x1234567890123456789012345678901234567890 \
  --data 0x1234abcd \
  --gas 100000 \
  --value 1000000000000000000

# Using a custom RPC endpoint
tevm call 0x1234567890123456789012345678901234567890 \
  --rpc https://mainnet.infura.io/v3/YOUR-PROJECT-ID \
  --data 0x1234abcd

# With advanced options
tevm call 0x1234567890123456789012345678901234567890 \
  --data 0x1234abcd \
  --from 0xabcdef1234567890abcdef1234567890abcdef12 \
  --createTrace \
  --createTransaction on-success
```

### contract

Call a specific function on a contract with ABI.

```bash
# Basic usage
tevm contract 0x1234567890123456789012345678901234567890 balanceOf \
  --abi ./abis/erc20.json \
  --args '["0xabcdef1234567890abcdef1234567890abcdef12"]'

# With gas and value parameters
tevm contract 0x1234567890123456789012345678901234567890 transfer \
  --abi ./abis/erc20.json \
  --args '["0xabcdef1234567890abcdef1234567890abcdef12", "1000000000000000000"]' \
  --gas 100000 \
  --value 0

# Using a custom RPC endpoint
tevm contract 0x1234567890123456789012345678901234567890 balanceOf \
  --rpc https://mainnet.infura.io/v3/YOUR-PROJECT-ID \
  --abi ./abis/erc20.json \
  --args '["0xabcdef1234567890abcdef1234567890abcdef12"]'

# With advanced options
tevm contract 0x1234567890123456789012345678901234567890 transfer \
  --abi ./abis/erc20.json \
  --args '["0xabcdef1234567890abcdef1234567890abcdef12", "1000000000000000000"]' \
  --from 0xabcdef1234567890abcdef1234567890abcdef12 \
  --createTrace \
  --createTransaction on-success
```

## Options

Both commands support many options for configuring the call:

### Common Options

- `--rpc`: RPC endpoint (default: http://localhost:8545)
- `--from`: Address to send the transaction from
- `--value`: ETH value to send in wei
- `--gas`: Gas limit for the transaction
- `--gasPrice`: Gas price in wei
- `--maxFeePerGas`: Maximum fee per gas (EIP-1559)
- `--maxPriorityFeePerGas`: Maximum priority fee per gas (EIP-1559)
- `--blockTag`: Block tag (latest, pending, etc.) or number
- `--createTrace`: Return a complete trace with the call
- `--createAccessList`: Return an access list mapping of addresses to storage keys
- `--createTransaction`: Whether to update state (on-success, always, never)
- `--formatJson`: Format output as JSON (default: true)

### Contract-Specific Options

- `--abi`: Path to ABI JSON file or inline JSON string (required)
- `--args`: JSON-encoded array of function arguments

## Examples

### Querying an ERC-20 Token Balance

```bash
tevm contract 0x6b175474e89094c44da98b954eedeac495271d0f balanceOf \
  --abi ./abis/erc20.json \
  --args '["0x41545f8b9472D758bB669ed8EaEeEcD7a9C4Ec29"]' \
  --rpc https://mainnet.infura.io/v3/YOUR-PROJECT-ID
```

### Sending a Low-Level Transaction

```bash
tevm call 0x6b175474e89094c44da98b954eedeac495271d0f \
  --data 0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045 \
  --rpc https://mainnet.infura.io/v3/YOUR-PROJECT-ID
```
