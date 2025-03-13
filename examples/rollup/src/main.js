import { createMemoryClient } from '@tevm/contract';
import { Token } from '../contracts/Token.sol';
import { formatUnits, parseUnits } from 'viem';

// DOM elements
const tokenNameElement = document.getElementById('token-name');
const tokenSymbolElement = document.getElementById('token-symbol');
const tokenDecimalsElement = document.getElementById('token-decimals');
const tokenTotalSupplyElement = document.getElementById('token-total-supply');
const tokenBalanceElement = document.getElementById('token-balance');
const outputElement = document.getElementById('output');

// Transfer form elements
const transferToInput = document.getElementById('transfer-to');
const transferAmountInput = document.getElementById('transfer-amount');
const transferButton = document.getElementById('transfer-button');

// Mint form elements
const mintAmountInput = document.getElementById('mint-amount');
const mintButton = document.getElementById('mint-button');

// Burn form elements
const burnAmountInput = document.getElementById('burn-amount');
const burnButton = document.getElementById('burn-button');

// Log function
const log = (message) => {
  console.log(message);
  outputElement.textContent += `${message}\n`;
  // Auto-scroll to bottom
  outputElement.scrollTop = outputElement.scrollHeight;
};

// Clear output
const clearOutput = () => {
  outputElement.textContent = '';
};

// Format token amount with decimals
const formatTokenAmount = (amount, decimals) => {
  return formatUnits(amount, decimals);
};

// Parse token amount with decimals
const parseTokenAmount = (amount, decimals) => {
  return parseUnits(amount.toString(), decimals);
};

// Main function
async function main() {
  try {
    clearOutput();
    log('Initializing Tevm Memory Client...');
    
    // Create a memory client
    const client = createMemoryClient();
    
    // Deploy the Token contract
    log('Deploying Token contract...');
    const token = await client.deployContract(Token, ['Tevm Token', 'TEVM', 18, 1000000n]);
    log(`Token deployed at address: ${token.address}`);
    
    // Store the default account address
    const defaultAccount = '0x' + 'a1b2c3d4e5f6'.padStart(40, '0');
    log(`Default account: ${defaultAccount}`);
    
    // Update token info UI
    async function updateTokenInfo() {
      try {
        const name = await token.read.name();
        const symbol = await token.read.symbol();
        const decimals = await token.read.decimals();
        const totalSupply = await token.read.totalSupply();
        const balance = await token.read.balanceOf([defaultAccount]);
        
        tokenNameElement.textContent = name;
        tokenSymbolElement.textContent = symbol;
        tokenDecimalsElement.textContent = decimals.toString();
        tokenTotalSupplyElement.textContent = formatTokenAmount(totalSupply, decimals);
        tokenBalanceElement.textContent = formatTokenAmount(balance, decimals);
      } catch (error) {
        log(`Error updating token info: ${error.message}`);
      }
    }
    
    // Initial update
    await updateTokenInfo();
    
    // Transfer function
    transferButton.addEventListener('click', async () => {
      try {
        const to = transferToInput.value;
        const amount = transferAmountInput.value;
        
        if (!to || !amount) {
          log('Please enter both address and amount');
          return;
        }
        
        log(`Transferring ${amount} tokens to ${to}...`);
        const decimals = await token.read.decimals();
        const parsedAmount = parseTokenAmount(amount, decimals);
        
        await token.write.transfer([to, parsedAmount]);
        log('Transfer successful!');
        
        // Update token info
        await updateTokenInfo();
      } catch (error) {
        log(`Transfer error: ${error.message}`);
      }
    });
    
    // Mint function
    mintButton.addEventListener('click', async () => {
      try {
        const amount = mintAmountInput.value;
        
        if (!amount) {
          log('Please enter an amount');
          return;
        }
        
        log(`Minting ${amount} tokens...`);
        const decimals = await token.read.decimals();
        const parsedAmount = parseTokenAmount(amount, decimals);
        
        await token.write.mint([defaultAccount, parsedAmount]);
        log('Mint successful!');
        
        // Update token info
        await updateTokenInfo();
      } catch (error) {
        log(`Mint error: ${error.message}`);
      }
    });
    
    // Burn function
    burnButton.addEventListener('click', async () => {
      try {
        const amount = burnAmountInput.value;
        
        if (!amount) {
          log('Please enter an amount');
          return;
        }
        
        log(`Burning ${amount} tokens...`);
        const decimals = await token.read.decimals();
        const parsedAmount = parseTokenAmount(amount, decimals);
        
        await token.write.burn([parsedAmount]);
        log('Burn successful!');
        
        // Update token info
        await updateTokenInfo();
      } catch (error) {
        log(`Burn error: ${error.message}`);
      }
    });
    
    log('Setup complete!');
  } catch (error) {
    log(`Error: ${error.message}`);
    console.error(error);
  }
}

// Initialize the app
main();