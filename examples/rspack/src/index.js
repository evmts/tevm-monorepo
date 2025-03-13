import { createMemoryClient } from '@tevm/contract';
import { NFT } from '../contracts/NFT.sol';

// DOM elements
const collectionNameElement = document.getElementById('collection-name');
const collectionSymbolElement = document.getElementById('collection-symbol');
const totalSupplyElement = document.getElementById('total-supply');
const nftGridElement = document.getElementById('nft-grid');
const logsElement = document.getElementById('logs');

// Form elements
const recipientInput = document.getElementById('recipient');
const tokenNameInput = document.getElementById('token-name');
const tokenUriInput = document.getElementById('token-uri');
const mintButton = document.getElementById('mint-button');

// Default account and colors for NFTs
const defaultAccount = '0x' + '1234567890abcdef'.padStart(40, '0');
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33F3', 
  '#33FFF3', '#F3FF33', '#FF3333', '#33FF33', '#3333FF'
];

// Logging function
const log = (message) => {
  console.log(message);
  logsElement.textContent += `${message}\n`;
  logsElement.scrollTop = logsElement.scrollHeight;
};

// Clear logs
const clearLogs = () => {
  logsElement.textContent = '';
};

// Generate a random color
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

// Create an NFT card element
const createNftCard = (id, name, uri) => {
  const color = getRandomColor();
  
  const card = document.createElement('div');
  card.className = 'nft-item';
  
  const image = document.createElement('div');
  image.className = 'nft-image';
  image.style.backgroundColor = color;
  image.textContent = `#${id}`;
  
  const title = document.createElement('h3');
  title.textContent = name;
  
  const idText = document.createElement('p');
  idText.textContent = `ID: ${id}`;
  
  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(idText);
  
  return card;
};

// Update NFT display
const updateNftDisplay = async (nftContract) => {
  try {
    // Clear existing NFTs
    while (nftGridElement.firstChild) {
      nftGridElement.removeChild(nftGridElement.firstChild);
    }
    
    const totalSupply = await nftContract.read.totalSupply();
    
    if (totalSupply === 0n) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No NFTs minted yet.';
      nftGridElement.appendChild(emptyMessage);
      return;
    }
    
    // Loop through all tokens and display them
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = BigInt(i);
      const owner = await nftContract.read.ownerOf([tokenId]);
      
      // Only show NFTs owned by the default account
      if (owner.toLowerCase() === defaultAccount.toLowerCase()) {
        const tokenName = await nftContract.read.tokenName([tokenId]);
        const tokenUri = await nftContract.read.tokenURI([tokenId]);
        
        const nftCard = createNftCard(i, tokenName, tokenUri);
        nftGridElement.appendChild(nftCard);
      }
    }
    
    // If no NFTs were added, show a message
    if (nftGridElement.children.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'You don\'t own any NFTs yet.';
      nftGridElement.appendChild(emptyMessage);
    }
  } catch (error) {
    log(`Error updating NFT display: ${error.message}`);
  }
};

// Update collection info
const updateCollectionInfo = async (nftContract) => {
  try {
    const name = await nftContract.read.name();
    const symbol = await nftContract.read.symbol();
    const totalSupply = await nftContract.read.totalSupply();
    
    collectionNameElement.textContent = name;
    collectionSymbolElement.textContent = symbol;
    totalSupplyElement.textContent = totalSupply.toString();
  } catch (error) {
    log(`Error updating collection info: ${error.message}`);
  }
};

// Main function
async function main() {
  try {
    clearLogs();
    log('Initializing Tevm Memory Client...');
    
    // Create a memory client
    const client = createMemoryClient();
    
    // Deploy NFT contract
    log('Deploying NFT contract...');
    const nftContract = await client.deployContract(NFT, ['Tevm NFT Collection', 'TEVM']);
    log(`NFT contract deployed at: ${nftContract.address}`);
    
    // Set recipient input to default account
    recipientInput.value = defaultAccount;
    
    // Update UI with initial data
    await updateCollectionInfo(nftContract);
    await updateNftDisplay(nftContract);
    
    // Mint button handler
    mintButton.addEventListener('click', async () => {
      try {
        const recipient = recipientInput.value;
        const tokenName = tokenNameInput.value;
        const tokenUri = tokenUriInput.value;
        
        if (!recipient || !tokenName || !tokenUri) {
          log('Please fill in all fields');
          return;
        }
        
        log(`Minting NFT "${tokenName}" to ${recipient}...`);
        
        await nftContract.write.safeMint([recipient, tokenName, tokenUri]);
        log('NFT minted successfully!');
        
        // Clear form
        tokenNameInput.value = '';
        tokenUriInput.value = '';
        
        // Update UI
        await updateCollectionInfo(nftContract);
        await updateNftDisplay(nftContract);
      } catch (error) {
        log(`Error minting NFT: ${error.message}`);
      }
    });
    
    log('Setup complete! You can now mint NFTs.');
  } catch (error) {
    log(`Error: ${error.message}`);
    console.error(error);
  }
}

// Initialize the application
main();