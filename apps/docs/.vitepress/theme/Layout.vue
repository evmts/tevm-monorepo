<script>
import {VPNavsdf} from 'vitepress'

export default {
  // JavaScript for component
};
</script>

<template>
<div class="flex flex-col min-h-screen bg-gray-200 text-[#403f53]">
   <header class="w-full px-4 py-6 bg-gray-200 text-[#403f53]">
  <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between">
    <a href="#" class="text-2xl sm:text-3xl font-bold hover:text-yellow-600 transition-colors duration-200">
      EVM<span class="hover:text-blue-600 transition-colors duration-200">ts</span>
    </a>
    <!-- Responsive Nav: hidden on small screens, visible on medium screens and up -->
    <nav class="hidden sm:flex space-x-4 mt-4 sm:mt-0">
      <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Why EVMts</a>
      <!-- Repeat for other links -->
    </nav>
    <!-- Hamburger Icon for Mobile: visible on small screens, hidden on medium screens and up -->
    <button class="sm:hidden">
      <!-- Icon or text for menu button -->
    </button>
  </div>
</header>
   <main class="flex-grow container mx-auto px-4 py-12 flex">
      <div class="w-1/2 text-[#403f53]">
         <h1 class="text-5xl font-extrabold mb-8">Rapidly build next-generation <span class="text-purple-600">Ethereum</span> UIs with end-to-end <span class="text-blue-600">typesafety</span> and a JavaScript native <span class="text-yellow-600">EVM</span></h1>
         <p class="text-xl mb-6">
            Gain full access to the 
            <span class="text-yellow-600">EVM</span> within your 
            <span class="text-blue-600">TypeScript</span> code, including local execution, forge-style scripting, contract tracing and a custom solidity bundler tailored for developing on <span class="text-purple-600">Ethereum</span>.
         </p>
         <button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-3 rounded-md bg-pink-300 text-black hover:bg-pink-400">
         Quick Start
         </button><button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-10 px-6 py-3 rounded-md border-blue-300 text-blue-300 bg-white hover:bg-gray-200 ml-4">
         Try Live Demo
         </button>
      </div>
      <div class="w-1/2 bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 p-8 rounded-lg">
         <pre class="text-sm text-[#403f53] bg-gray-200 p-4 rounded-lg overflow-auto"><code class="language-javascript">const evm = new EVM();
evm.connect('http://localhost:8545');
const contract = evm.contract('0x...');
contract.call('balanceOf', '0x...');</code></pre>
      </div>
   </main>
   <section class="container mx-auto px-4 py-12 text-center">
      <div class="inline-flex items-center bg-gray-200 rounded-lg px-6 py-3 hover:bg-gray-300 transition-colors duration-200 cursor-pointer">
         <p class="text-[#403f53] mr-4">npx create-evmts-app@latest</p>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-5 h-5 text-[#403f53] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
         </svg>
      </div>
      <h2 class="text-3xl mt-8 text-[#403f53]">What can I do with <span class="text-yellow-600">EVM</span><span class="text-blue-600">ts</span>?</h2>
      <p class="text-xl mt-4 text-[#403f53]">Rapidly build performant local-first onchain experiences</p>
   </section>
   <section class="container mx-auto px-4 py-12 grid grid-cols-3 gap-8 justify-center">
      <div class="bg-red-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-red-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Estimate gas and simulate EVM calls in Browser and Node.js environments instantly</p>
      </div>
      <div class="bg-orange-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-orange-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Import solidity directly into your TypeScript files without juggling abis</p>
      </div>
      <div class="bg-yellow-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-yellow-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Leverage foundry-style solidity scripting for your JavaScript applications</p>
      </div>
      <div class="bg-green-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-green-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Debug why solidity calls are failing with powerful dev tools</p>
      </div>
      <div class="bg-blue-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-blue-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Get the full power of solidity in your TypeScript LSP including natspec comments on hover and go-to-definition</p>
      </div>
      <div class="bg-purple-200 p-4 rounded-md flex items-center space-x-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" w-10 h-10 text-purple-600">
            <path d="M14 4c0-1.1.9-2 2-2"></path>
            <path d="M20 2c1.1 0 2 .9 2 2"></path>
            <path d="M22 8c0 1.1-.9 2-2 2"></path>
            <path d="M16 10c-1.1 0-2-.9-2-2"></path>
            <path d="m3 7 3 3 3-3"></path>
            <path d="M6 10V5c0-1.7 1.3-3 3-3h1"></path>
            <rect width="8" height="8" x="2" y="14" rx="2"></rect>
         </svg>
         <p>Build powerful user experiences with multi user optimistic updates</p>
      </div>
   </section>
   <section class="container mx-auto px-4 py-12 flex justify-between items-start">
      <div class="w-full text-[#403f53] text-center">
         <h2 class="text-5xl font-extrabold mb-8">Ethereum<span class="text-purple-600"> Virtual Machine</span> in your <span class="text-blue-600">JavaScript</span></h2>
      </div>
      <div class="w-1/2 text-[#403f53]">
         <p class="text-xl mb-6">Placeholder text goes here...</p>
      </div>
      <div class="w-1/2 flex flex-col items-start space-y-4">
         <h3 class="text-2xl font-bold text-[#403f53]">Demo</h3>
         <button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-3 rounded-md bg-pink-300 text-black hover:bg-pink-400">
         Mint eth
         </button><button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-10 px-6 py-3 rounded-md border-blue-300 text-blue-300 bg-white hover:bg-gray-200 ml-4">
         Connect Wallet
         </button>
         <div class="bg-gray-200 rounded-full px-4 py-2 text-[#403f53]">
            12345
         </div>
      </div>
   </section>
   <footer class="w-full px-4 py-6 bg-gray-200 text-[#403f53]">
      <div class="container mx-auto text-center"></div>
   </footer>
</div>
</template>


