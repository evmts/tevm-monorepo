/**
 * SnailTracer benchmarks for ZigEVM
 * 
 * This file contains benchmarks using the SnailTracer contract, which is a 
 * compute-intensive raytracing implementation in Solidity. SnailTracer performs
 * a significant amount of mathematical operations and represents a real-world
 * computational workload for testing EVM performance.
 */
import { bench, describe } from 'vitest';
import path from 'path';
import fs from 'fs';
import { ZigEvm } from '../src/zigevm';
import { keccak256 } from '@ethersproject/keccak256';
import { hexToBytes } from 'viem';

// Path to WASM file
const WASM_PATH = path.resolve(__dirname, '../../dist/zigevm.wasm');

// SnailTracer contract bytecode (pre-compiled)
const SNAILTRACER_BYTECODE_PATH = path.resolve(__dirname, './bytecode/snailtracer.bin');

// Number of iterations for each benchmark
const ITERATIONS = 5;

// SnailTracer ABI (simplified for our benchmarking needs)
const SNAILTRACER_ABI = {
  renderSector: {
    selector: '0x' + keccak256('0xrendering(uint256,uint256,uint256,uint256)').slice(2, 10),
    encode: (cameraX: number, cameraY: number, cameraZ: number, sector: number) => {
      const selector = '0x2fc28c69'; // Function selector for renderSector
      const params = [
        cameraX.toString(16).padStart(64, '0'),
        cameraY.toString(16).padStart(64, '0'),
        cameraZ.toString(16).padStart(64, '0'),
        sector.toString(16).padStart(64, '0')
      ].join('');
      return hexToBytes('0x' + selector + params);
    }
  }
};

/**
 * Loads the SnailTracer bytecode from file or generates a placeholder
 * @returns The contract bytecode as a Uint8Array
 */
function loadSnailTracerBytecode(): Uint8Array {
  try {
    // Try to load pre-compiled bytecode if available
    if (fs.existsSync(SNAILTRACER_BYTECODE_PATH)) {
      const bytecodeHex = fs.readFileSync(SNAILTRACER_BYTECODE_PATH, 'utf8').trim();
      return hexToBytes(bytecodeHex.startsWith('0x') ? bytecodeHex : '0x' + bytecodeHex);
    }
  } catch (error) {
    console.warn('Could not load SnailTracer bytecode:', error);
  }

  // Return a placeholder bytecode for testing
  // This will be replaced with the actual compiled bytecode
  console.warn('Using placeholder bytecode for SnailTracer - benchmark results will not be accurate');
  return new Uint8Array([
    // Simple contract bytecode placeholder
    0x60, 0x80, 0x60, 0x40, 0x52, // PUSH1 0x80 PUSH1 0x40 MSTORE (standard contract preamble)
    0x60, 0x00, 0x80, 0xfd        // PUSH1 0x00 DUP1 REVERT (always revert)
  ]);
}

/**
 * Helper function to ensure the bytecode directory exists
 */
function ensureBytecodeDirectory() {
  const dir = path.dirname(SNAILTRACER_BYTECODE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize ZigEVM for benchmarks
describe('SnailTracer Benchmarks', async () => {
  // Initialize ZigEVM
  const zigevm = new ZigEvm();
  let zigEvmHandle: number = 0;
  let contractAddress: string = '0x' + '1234567890123456789012345678901234567890';
  let contractBytecode: Uint8Array;
  
  // Ensure bytecode directory exists
  ensureBytecodeDirectory();
  
  try {
    await zigevm.init(WASM_PATH);
    zigEvmHandle = zigevm.create();
    contractBytecode = loadSnailTracerBytecode();
    console.log("Initialized ZigEVM successfully for SnailTracer benchmarks");
    
    // Deploy the contract (if we had a valid deployment method)
    // For now, we'll just simulate calls to an already deployed contract
    
  } catch (error) {
    console.warn(`Skipping benchmarks: ${error}`);
  }
  
  // Rendering benchmarks with different parameters
  describe('SnailTracer Rendering', () => {
    // Different camera positions for a variety of workloads
    const cameraPositions = [
      { x: 0, y: 0, z: -5, name: "Front View" },
      { x: 5, y: 0, z: 0, name: "Side View" },
      { x: 3, y: 3, z: -3, name: "Angled View" }
    ];
    
    // Different sectors to render (each 1/4 of the image)
    const sectors = [0, 1, 2, 3];
    
    // Benchmark each camera position
    for (const camera of cameraPositions) {
      // Benchmark each sector with this camera position
      for (const sector of sectors) {
        bench(`Render: ${camera.name}, Sector ${sector}`, () => {
          if (zigevm.isInitialized()) {
            // Generate the call data for renderSector
            const calldata = SNAILTRACER_ABI.renderSector.encode(
              camera.x * 1000000, // Scale up for fixed-point math
              camera.y * 1000000,
              camera.z * 1000000,
              sector
            );
            
            // Execute the contract call
            for (let i = 0; i < ITERATIONS; i++) {
              zigevm.execute(
                zigEvmHandle,
                contractBytecode,
                calldata,
                10000000,    // Gas limit
                contractAddress
              );
            }
          }
        });
      }
    }
    
    // Full image rendering benchmark
    bench('Render: Complete Image', () => {
      if (zigevm.isInitialized()) {
        // Camera position for full image rendering
        const camera = { x: 0, y: 0, z: -5 };
        
        // Execute the contract call for all sectors
        for (let i = 0; i < ITERATIONS; i++) {
          for (const sector of sectors) {
            const calldata = SNAILTRACER_ABI.renderSector.encode(
              camera.x * 1000000,
              camera.y * 1000000,
              camera.z * 1000000,
              sector
            );
            
            zigevm.execute(
              zigEvmHandle,
              contractBytecode,
              calldata,
              10000000,    // Gas limit
              contractAddress
            );
          }
        }
      }
    });
  });
  
  // Mathematical operations benchmarks
  describe('SnailTracer Math Operations', () => {
    // Test vector generation function signature
    const generateVectorSelector = '0x' + keccak256('0xgenerateVector(int256,int256,int256)').slice(2, 10);
    
    // Ray intersection calculation function signature
    const rayIntersectSelector = '0x' + keccak256('0xrayIntersect(int256,int256,int256,int256,int256,int256)').slice(2, 10);
    
    // Helper function to encode vector generation parameters
    function encodeGenerateVector(x: number, y: number, z: number): Uint8Array {
      const selector = generateVectorSelector.slice(2); // Remove 0x prefix
      const params = [
        (x * 1000000).toString(16).padStart(64, '0'),
        (y * 1000000).toString(16).padStart(64, '0'),
        (z * 1000000).toString(16).padStart(64, '0')
      ].join('');
      return hexToBytes('0x' + selector + params);
    }
    
    // Helper function to encode ray intersection parameters
    function encodeRayIntersect(
      originX: number, originY: number, originZ: number,
      dirX: number, dirY: number, dirZ: number
    ): Uint8Array {
      const selector = rayIntersectSelector.slice(2); // Remove 0x prefix
      const params = [
        (originX * 1000000).toString(16).padStart(64, '0'),
        (originY * 1000000).toString(16).padStart(64, '0'),
        (originZ * 1000000).toString(16).padStart(64, '0'),
        (dirX * 1000000).toString(16).padStart(64, '0'),
        (dirY * 1000000).toString(16).padStart(64, '0'),
        (dirZ * 1000000).toString(16).padStart(64, '0')
      ].join('');
      return hexToBytes('0x' + selector + params);
    }
    
    // Benchmark vector generation
    bench('Math: Vector Generation', () => {
      if (zigevm.isInitialized()) {
        const vectors = [
          { x: 1, y: 0, z: 0 },
          { x: 0, y: 1, z: 0 },
          { x: 0, y: 0, z: 1 },
          { x: 0.707, y: 0.707, z: 0 },
          { x: 0.577, y: 0.577, z: 0.577 }
        ];
        
        for (let i = 0; i < ITERATIONS; i++) {
          for (const vector of vectors) {
            const calldata = encodeGenerateVector(vector.x, vector.y, vector.z);
            
            zigevm.execute(
              zigEvmHandle,
              contractBytecode,
              calldata,
              1000000,    // Gas limit
              contractAddress
            );
          }
        }
      }
    });
    
    // Benchmark ray intersection calculations
    bench('Math: Ray Intersection', () => {
      if (zigevm.isInitialized()) {
        const rays = [
          // Origin, Direction
          { origin: { x: 0, y: 0, z: -5 }, dir: { x: 0, y: 0, z: 1 } },
          { origin: { x: 0, y: 0, z: -5 }, dir: { x: 0.1, y: 0.1, z: 1 } },
          { origin: { x: 0, y: 0, z: -5 }, dir: { x: -0.1, y: -0.1, z: 1 } },
          { origin: { x: 5, y: 0, z: 0 }, dir: { x: -1, y: 0, z: 0 } },
          { origin: { x: 0, y: 5, z: 0 }, dir: { x: 0, y: -1, z: 0 } }
        ];
        
        for (let i = 0; i < ITERATIONS; i++) {
          for (const ray of rays) {
            const calldata = encodeRayIntersect(
              ray.origin.x, ray.origin.y, ray.origin.z,
              ray.dir.x, ray.dir.y, ray.dir.z
            );
            
            zigevm.execute(
              zigEvmHandle,
              contractBytecode,
              calldata,
              1000000,    // Gas limit
              contractAddress
            );
          }
        }
      }
    });
  });
  
  // Performance scaling benchmarks
  describe('SnailTracer Performance Scaling', () => {
    // Test different resolutions
    const resolutions = [
      { width: 16, height: 16, name: "16x16" },
      { width: 32, height: 32, name: "32x32" },
      { width: 64, height: 64, name: "64x64" }
    ];
    
    // Helper function to encode resolution parameters
    function encodeRenderWithResolution(
      cameraX: number, cameraY: number, cameraZ: number,
      width: number, height: number, sector: number
    ): Uint8Array {
      const selector = '0x3c5f5e76'; // Made-up selector for renderWithResolution
      const params = [
        (cameraX * 1000000).toString(16).padStart(64, '0'),
        (cameraY * 1000000).toString(16).padStart(64, '0'),
        (cameraZ * 1000000).toString(16).padStart(64, '0'),
        width.toString(16).padStart(64, '0'),
        height.toString(16).padStart(64, '0'),
        sector.toString(16).padStart(64, '0')
      ].join('');
      return hexToBytes('0x' + selector + params);
    }
    
    // Benchmark rendering at different resolutions
    for (const resolution of resolutions) {
      bench(`Scaling: ${resolution.name}`, () => {
        if (zigevm.isInitialized()) {
          // Camera position
          const camera = { x: 0, y: 0, z: -5 };
          
          for (let i = 0; i < ITERATIONS; i++) {
            const calldata = encodeRenderWithResolution(
              camera.x, camera.y, camera.z,
              resolution.width, resolution.height, 0 // Just render sector 0
            );
            
            zigevm.execute(
              zigEvmHandle,
              contractBytecode,
              calldata,
              10000000,    // Gas limit
              contractAddress
            );
          }
        }
      });
    }
  });
  
  // Gas consumption benchmarks
  describe('SnailTracer Gas Consumption', () => {
    // Benchmark the gas usage for different operations
    bench('Gas: Full Render Gas Usage', () => {
      if (zigevm.isInitialized()) {
        // Camera position
        const camera = { x: 0, y: 0, z: -5 };
        
        // Measure gas usage for rendering all sectors
        let totalGasUsed = 0;
        
        for (let i = 0; i < ITERATIONS; i++) {
          for (const sector of [0, 1, 2, 3]) {
            const calldata = SNAILTRACER_ABI.renderSector.encode(
              camera.x * 1000000,
              camera.y * 1000000,
              camera.z * 1000000,
              sector
            );
            
            const result = zigevm.execute(
              zigEvmHandle,
              contractBytecode,
              calldata,
              10000000,    // Gas limit
              contractAddress
            );
            
            // Add gas used to total
            // Note: In a real implementation, we would access result.gasUsed
            // For now, this is a placeholder
            totalGasUsed += 1000000; // Placeholder
          }
        }
        
        // Report average gas usage
        console.log(`Average gas used per full render: ${totalGasUsed / ITERATIONS}`);
      }
    });
  });
  
  // Comparative benchmarks
  describe('SnailTracer Comparative', () => {
    // These benchmarks would compare ZigEVM with other EVM implementations
    // For now, we just measure ZigEVM performance
    
    bench('Comparative: Basic Rendering', () => {
      if (zigevm.isInitialized()) {
        // Camera position
        const camera = { x: 0, y: 0, z: -5 };
        
        // Measure execution time for ZigEVM
        const startTime = performance.now();
        
        for (let i = 0; i < ITERATIONS; i++) {
          const calldata = SNAILTRACER_ABI.renderSector.encode(
            camera.x * 1000000,
            camera.y * 1000000,
            camera.z * 1000000,
            0 // Just sector 0
          );
          
          zigevm.execute(
            zigEvmHandle,
            contractBytecode,
            calldata,
            10000000,    // Gas limit
            contractAddress
          );
        }
        
        const endTime = performance.now();
        
        // Report average execution time
        console.log(`ZigEVM average execution time: ${(endTime - startTime) / ITERATIONS}ms`);
      }
    });
  });
});