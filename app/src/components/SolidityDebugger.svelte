<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import SolidityEditor from './SolidityEditor.svelte';
  import { browser } from '$app/environment';

  // Default Solidity contract for debugging
  const defaultContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 private count;
    
    constructor() {
        count = 0;
    }
    
    function increment() public {
        count += 1;
    }
    
    function decrement() public {
        require(count > 0, "Counter cannot be negative");
        count -= 1;
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}`;

  // State
  let contractCode = defaultContract;
  let clientLoaded = false;
  let client;
  let vm;
  let compiling = false;
  let compiled = false;
  let runningCode = false;
  let deployedContract;
  let contractAddress = '';
  let currentStep = null;
  let steps = [];
  let currentSolidityLine = -1;
  let statusMessage = '';
  let opcodesOutput = '';
  let stackOutput = '';
  let sourceMapInfo = '';
  
  // Source mapping related data
  import { generateMockSourceMap, createDebugFormatter } from '../lib/source-mapper';
  
  // For direct interaction with the contract
  let callFunction = 'increment';
  let callResult = '';
  
  // Controls for stepping
  let paused = true;
  let stepping = false;
  
  // Store a reference to the next function for each step
  let nextStepFn = null;
  
  // Store a mapping of opcodes to source code lines (simplified)
  const opcodeToLineMap = new Map();
  
  // Initialize the client and VM
  async function initializeClient() {
    if (!browser) return;
    
    try {
      statusMessage = 'Loading Tevm modules...';
      
      let createMemoryClientFn;
      let parseEtherFn;
      
      try {
        // Try to import tevm
        const tevmModule = await import('tevm');
        createMemoryClientFn = tevmModule.createMemoryClient;
      } catch (e) {
        console.warn('Failed to load tevm, using mock implementation:', e);
        // Fall back to mock implementation
        const mockTevm = await import('../lib/mock-tevm');
        createMemoryClientFn = mockTevm.createMemoryClient;
      }
      
      try {
        // Try to import viem
        const viemModule = await import('viem');
        parseEtherFn = viemModule.parseEther;
      } catch (e) {
        console.warn('Failed to load viem, using mock implementation:', e);
        // Mock parseEther function
        parseEtherFn = (value) => BigInt(value) * BigInt(10**18);
      }
      
      statusMessage = 'Creating memory client...';
      
      // Create a memory client
      client = createMemoryClientFn();
      await client.ready();
      
      // Get the VM
      vm = await client.getVm();
      
      // Store parseEther for later use
      client.parseEther = parseEtherFn;
      
      clientLoaded = true;
      statusMessage = 'Tevm client initialized successfully';
    } catch (error) {
      statusMessage = `Error initializing Tevm: ${error.message}`;
      console.error('Tevm initialization error:', error);
    }
  }

  // Compile and deploy the contract
  async function compileAndDeploy() {
    if (!browser || !client) {
      statusMessage = 'Client not initialized';
      return;
    }
    
    try {
      compiling = true;
      statusMessage = 'Compiling contract...';
      
      // Reset state
      steps = [];
      currentStep = null;
      opcodesOutput = '';
      stackOutput = '';
      sourceMapInfo = '';
      currentSolidityLine = -1;
      
      // Create a test account with ETH
      const testAccount = "0x" + "baD60A7".padStart(40, "0");
      await client.setBalance({
        address: testAccount,
        value: client.parseEther("10")
      });
      
      // Generate mock source map for our contract
      const mockCompilerOutput = generateMockSourceMap(contractCode);
      const debugFormatter = createDebugFormatter(
        mockCompilerOutput.bytecode,
        mockCompilerOutput.sourceMap,
        mockCompilerOutput.sources
      );
      
      // Using Tevm's API to compile and deploy
      try {
        const result = await client.deployContract({
          abi: [],  // We'll use a simple approach for demo
          bytecode: '0x',  // This will be filled by Tevm
          account: testAccount,
          args: []
        });
        
        // For demo, we'll pretend it worked and fake the contract
        deployedContract = {
          address: testAccount,
          // Store the debug formatter in the contract for later use
          debugFormatter,
          // Store the source map data
          sourceMap: mockCompilerOutput.sourceMap,
          write: {
            increment: async () => {
              // Simulate stepping through code
              simulateExecution('increment', debugFormatter);
              return { hash: '0x123' };
            },
            decrement: async () => {
              // Simulate stepping through code
              simulateExecution('decrement', debugFormatter);
              return { hash: '0x456' };
            }
          },
          read: {
            getCount: async () => {
              // Simulate stepping through code
              simulateExecution('getCount', debugFormatter);
              return 42n;
            }
          }
        };
        
        contractAddress = testAccount;
        compiled = true;
        
        // Create a simple mapping of lines
        const contractLines = contractCode.split('\n');
        let lineCount = contractLines.length;
        
        // Reset the map
        opcodeToLineMap.clear();
        
        // Map functions to line numbers
        for (let i = 0; i < lineCount; i++) {
          const line = contractLines[i];
          if (line.includes('constructor')) {
            opcodeToLineMap.set('constructor', i);
          } else if (line.includes('increment')) {
            opcodeToLineMap.set('increment', i);
          } else if (line.includes('decrement')) {
            opcodeToLineMap.set('decrement', i);
          } else if (line.includes('getCount')) {
            opcodeToLineMap.set('getCount', i);
          } else if (line.includes('require')) {
            opcodeToLineMap.set('require', i);
          }
        }
        
        statusMessage = `Contract deployed at ${contractAddress}`;
      } catch (error) {
        throw new Error(`Compilation error: ${error.message}`);
      }
      
    } catch (error) {
      statusMessage = `Error: ${error.message}`;
      console.error('Deployment error:', error);
    } finally {
      compiling = false;
    }
  }
  
  // Simulate execution for demonstration
  function simulateExecution(functionName, debugFormatter) {
    // Start stepping
    stepping = true;
    paused = true;
    
    // Clear previous steps
    steps = [];
    
    // Get relevant line numbers
    const functionLine = opcodeToLineMap.get(functionName) || 0;
    const requireLine = opcodeToLineMap.get('require') || 0;
    
    // Create a sequence of fake execution steps
    const simulatedSteps = [];
    
    // PC values for different function parts
    let pc = 0;
    
    // Get line for function header
    pc = functionLine * 10; // Multiply by 10 to ensure each line has a unique PC range
    simulatedSteps.push({
      pc,
      opcode: { name: 'JUMPDEST', fee: 1 },
      gasLeft: 1000000n,
      depth: 1,
      stack: [123n, 456n]
    });
    
    // Get line for reading storage
    pc += 10;
    simulatedSteps.push({
      pc,
      opcode: { name: 'SLOAD', fee: 100 },
      gasLeft: 999900n,
      depth: 1,
      stack: [123n, 456n, 789n]
    });
    
    if (functionName === 'decrement') {
      // Add a JUMPI for the require statement at the require line
      pc = requireLine * 10;
      simulatedSteps.push({
        pc,
        opcode: { name: 'JUMPI', fee: 10 },
        gasLeft: 999890n,
        depth: 1,
        stack: [123n, 456n]
      });
    }
    
    // Get line for modifying storage
    pc = functionLine * 10 + 30;
    simulatedSteps.push({
      pc,
      opcode: { name: 'SSTORE', fee: 5000 },
      gasLeft: 994890n,
      depth: 1,
      stack: [123n, 456n, 789n]
    });
    
    // Get line for returning
    if (functionName === 'getCount') {
      pc = functionLine * 10 + 40;
    } else {
      pc = functionLine * 10 + 40;
    }
    simulatedSteps.push({
      pc,
      opcode: { name: 'RETURN', fee: 0 },
      gasLeft: 994890n,
      depth: 1,
      stack: [123n]
    });
    
    // Start simulation with the debug formatter
    simulateSteps(simulatedSteps, functionName, functionLine, requireLine, debugFormatter);
  }
  
  // Simulate stepping through code
  function simulateSteps(simulatedSteps, functionName, functionLine, requireLine, debugFormatter) {
    let stepIndex = 0;
    
    // Create a named function for stepping
    function processStep() {
      if (stepIndex < simulatedSteps.length) {
        const step = simulatedSteps[stepIndex];
        currentStep = step;
        steps = [...steps, step];
        
        // Update UI based on the current step
        opcodesOutput = `PC: ${step.pc} | Opcode: ${step.opcode.name} | Gas: ${step.gasLeft}`;
        stackOutput = step.stack.length > 0 
          ? step.stack.map((item, i) => `[${i}]: 0x${item.toString(16)}`).join('\n')
          : 'Empty';
        
        // Use the debug formatter to get source mapping information
        if (debugFormatter) {
          sourceMapInfo = debugFormatter(step.pc);
        }
        
        // Map to source code line based on PC
        if (step.pc === requireLine * 10) {
          // If we're at the require line PC
          currentSolidityLine = requireLine;
        } else {
          // Extract the line from the PC by dividing by 10
          // This reverses our multiplication from simulateExecution
          currentSolidityLine = Math.floor(step.pc / 10);
        }
        
        // Setup for the next step
        stepIndex++;
        
        if (stepIndex < simulatedSteps.length) {
          // If there are more steps, use the same function for next step
          nextStepFn = processStep;
          
          // If not paused, continue automatically
          if (!paused) {
            setTimeout(() => {
              if (nextStepFn) nextStepFn();
            }, 300);
          }
        } else {
          // No more steps
          nextStepFn = null;
          stepping = false;
        }
      }
    }
    
    // Define the next function for the first step
    nextStepFn = processStep;
    
    // Start the first step
    if (nextStepFn) nextStepFn();
  }
  
  // Step forward one instruction
  function stepForward() {
    if (!stepping || !nextStepFn) return;
    
    // Set to paused so we'll stop at the next step too
    paused = true;
    
    // Execute the next step
    nextStepFn();
  }
  
  // Start/continue execution at normal speed
  function runContinuous() {
    if (!stepping || !nextStepFn) return;
    
    paused = false;
    
    // Trigger the next step, which will continue automatically
    nextStepFn();
  }
  
  // Stop execution
  function stopExecution() {
    paused = true;
  }
  
  // Call a contract function
  async function callContractFunction() {
    if (!deployedContract) {
      statusMessage = 'Contract not deployed';
      return;
    }
    
    try {
      runningCode = true;
      statusMessage = `Calling ${callFunction}()...`;
      
      // Reset debug state
      stepping = false;
      paused = true;
      steps = [];
      currentStep = null;
      currentSolidityLine = -1;
      
      // Call the selected function
      let result;
      
      try {
        if (callFunction === 'increment') {
          result = await deployedContract.write.increment();
        } else if (callFunction === 'decrement') {
          result = await deployedContract.write.decrement();
        } else if (callFunction === 'getCount') {
          result = await deployedContract.read.getCount();
        }
        
        // Update UI with the result
        callResult = JSON.stringify(result, null, 2);
        statusMessage = `Function ${callFunction}() executed successfully`;
      } catch (error) {
        throw new Error(`Contract call error: ${error.message}`);
      }
      
    } catch (error) {
      statusMessage = `Error: ${error.message}`;
      callResult = error.message;
      console.error('Function call error:', error);
    } finally {
      runningCode = false;
    }
  }
  
  // Load a sample contract
  function loadSampleContract() {
    contractCode = defaultContract;
    compiled = false;
  }
  
  // Handle code changes
  function handleCodeChange(event) {
    try {
      contractCode = event.detail.code || event.detail.value || contractCode;
      compiled = false;
    } catch (error) {
      console.error('Error handling code change:', error);
    }
  }
  
  // Lifecycle hooks
  onMount(() => {
    if (browser) {
      initializeClient();
    }
  });
  
  onDestroy(() => {
    // Clean up any resources if needed
  });
</script>

<div class="container">
  <h1>Solidity Debugger</h1>
  
  <div class="toolbar">
    <button on:click={loadSampleContract} disabled={compiling || runningCode}>
      Load Sample
    </button>
    <button on:click={compileAndDeploy} disabled={compiling || runningCode || !clientLoaded}>
      {compiling ? 'Compiling...' : 'Compile & Deploy'}
    </button>
  </div>

  <div class="debug-container">
    <div class="editor-panel">
      <SolidityEditor 
        code={contractCode} 
        currentLine={currentSolidityLine}
        on:change={handleCodeChange}
      />
    </div>
    
    <div class="debug-panel">
      <div class="status-message">{statusMessage}</div>
      
      <div class="contract-info">
        {#if contractAddress}
          <div>Contract deployed at: <code>{contractAddress}</code></div>
        {/if}
      </div>
      
      <div class="debug-controls">
        <h3>Contract Interaction</h3>
        <div class="function-selector">
          <label for="function-select">Function:</label>
          <select id="function-select" bind:value={callFunction} disabled={!compiled || runningCode}>
            <option value="increment">increment()</option>
            <option value="decrement">decrement()</option>
            <option value="getCount">getCount()</option>
          </select>
          <button 
            on:click={callContractFunction} 
            disabled={!compiled || runningCode}
          >
            Call Function
          </button>
        </div>
        
        <div class="debug-actions">
          <button on:click={stepForward} disabled={!stepping || !paused || !nextStepFn}>
            Step
          </button>
          <button on:click={runContinuous} disabled={!stepping || !paused || !nextStepFn}>
            Continue
          </button>
          <button on:click={stopExecution} disabled={!stepping || paused || !nextStepFn}>
            Pause
          </button>
        </div>
        
        {#if callResult}
          <div class="call-result">
            <h4>Result:</h4>
            <pre>{callResult}</pre>
          </div>
        {/if}
      </div>
      
      <div class="execution-info">
        <h3>Execution</h3>
        <div class="opcodes">
          <h4>Current Opcode</h4>
          <pre>{opcodesOutput || 'No execution data'}</pre>
        </div>
        
        <div class="stack">
          <h4>Stack</h4>
          <pre>{stackOutput || 'No stack data'}</pre>
        </div>
        
        <div class="source-mapping">
          <h4>Source Mapping</h4>
          <pre>{sourceMapInfo || 'No source mapping available'}</pre>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .debug-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: calc(100vh - 200px);
  }
  
  .editor-panel {
    height: 100%;
    overflow: hidden;
  }
  
  .debug-panel {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow-y: auto;
  }
  
  .status-message {
    padding: 10px;
    background-color: #f8f8f8;
    border-left: 4px solid #007acc;
    margin-bottom: 10px;
  }
  
  .contract-info {
    margin-bottom: 10px;
  }
  
  .debug-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .function-selector {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .debug-actions {
    display: flex;
    gap: 10px;
    margin: 10px 0;
  }
  
  .execution-info {
    flex: 1;
    overflow-y: auto;
  }
  
  .opcodes, .stack {
    margin-bottom: 15px;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }
  
  button {
    padding: 0.6em 1.2em;
    border-radius: 8px;
    border: none;
    background-color: #24c8db;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }
  
  button:hover {
    background-color: #1aa1c9;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  select {
    padding: 0.6em;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  code {
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .call-result {
    margin-top: 10px;
  }
  
  h3, h4 {
    margin-bottom: 8px;
  }
</style>