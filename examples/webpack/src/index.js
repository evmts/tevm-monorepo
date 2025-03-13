import { createMemoryClient } from '@tevm/contract'
import { Counter } from '../contracts/Counter.sol'

// Initialize elements
const counterValueElement = document.getElementById('counter-value')
const incrementButton = document.getElementById('increment')
const decrementButton = document.getElementById('decrement')
const resetButton = document.getElementById('reset')
const outputElement = document.getElementById('output')

// Log function that outputs to the page
const log = (message) => {
	console.log(message)
	outputElement.textContent += `${message}\n`
}

// Clear output
const clearOutput = () => {
	outputElement.textContent = ''
}

async function main() {
	try {
		clearOutput()
		log('Initializing Tevm Memory Client...')

		// Create a memory client
		const client = createMemoryClient()

		// Deploy the Counter contract with an initial count of 10
		log('Deploying Counter contract...')
		const contract = await client.deployContract(Counter, [10n])
		log(`Contract deployed at: ${contract.address}`)

		// Read the initial count
		const initialCount = await contract.read.count()
		log(`Initial count: ${initialCount}`)
		counterValueElement.textContent = initialCount.toString()

		// Add button event listeners
		incrementButton.addEventListener('click', async () => {
			log('Incrementing counter...')
			await contract.write.increment()
			const newCount = await contract.read.count()
			log(`New count: ${newCount}`)
			counterValueElement.textContent = newCount.toString()
		})

		decrementButton.addEventListener('click', async () => {
			log('Decrementing counter...')
			try {
				await contract.write.decrement()
				const newCount = await contract.read.count()
				log(`New count: ${newCount}`)
				counterValueElement.textContent = newCount.toString()
			} catch (error) {
				log(`Error: ${error.message}`)
			}
		})

		resetButton.addEventListener('click', async () => {
			log('Resetting counter...')
			await contract.write.reset()
			const newCount = await contract.read.count()
			log(`New count: ${newCount}`)
			counterValueElement.textContent = newCount.toString()
		})

		log('Setup complete!')
	} catch (error) {
		log(`Error: ${error.message}`)
		console.error(error)
	}
}

main()
