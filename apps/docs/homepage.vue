<template>
  <div class="flex flex-col min-h-screen bg-black">
    <header class="w-full px-4 py-6 bg-zinc-900 text-white">
      <div class="container mx-auto flex items-center justify-between">
        <a class="text-2xl font-bold hover:text-yellow-300 transition-colors duration-200" href="#">
          EVM<span class="hover:text-blue-300 transition-colors duration-200">ts</span>
        </a>
        <nav class="space-x-4">
          <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Why EVMts</a>
          <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Introduction</a>
          <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Reference</a>
          <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Tutorial</a>
          <a class="text-lg hover:underline transform hover:scale-110 transition-transform duration-200" href="#">Quick Start</a>
        </nav>
      </div>
    </header>
    <main class="flex-grow container mx-auto px-4 py-12 flex">
      <div class="w-1/2 text-white">
        <h1 class="text-5xl font-extrabold mb-8">
          Rapidly build next-generation <span class="text-purple-300">Ethereum</span> UIs with end-to-end <span class="text-blue-300">typesafety</span> and a JavaScript native <span class="text-yellow-300">EVM</span>
        </h1>
        <p class="text-xl mb-6">
          Gain full access to the <span class="text-yellow-300">EVM</span> within your <span class="text-blue-300">TypeScript</span> code, including local execution, forge-style scripting, contract tracing and a custom solidity bundler tailored for developing on <span class="text-purple-300">Ethereum</span>.
        </p>
        <button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-3 rounded-md bg-pink-300 text-white hover:bg-pink-400">
          Quick Start
        </button>
        <button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-10 px-6 py-3 rounded-md border-blue-300 text-blue-300 bg-black hover:bg-gray-800 ml-4">
          Try Live Demo
        </button>
      </div>
      <div class="w-1/2 bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 p-8 rounded-lg">
        <pre class="text-sm text-gray-800 bg-black p-4 rounded-lg overflow-auto">
          <code class="language-javascript">
const evm = new EVM();
evm.connect('http://localhost:8545');
const contract = evm.contract('0x...');
contract.call('balanceOf', '0x...');
          </code>
        </pre>
      </div>
    </main>
    <!-- Remaining sections here -->
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
