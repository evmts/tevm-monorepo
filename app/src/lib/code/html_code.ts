export const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tevm Example</title>
  <script type="module">
    import { createMemoryClient } from 'tevm';
    
    async function init() {
      const client = createMemoryClient();
      const blockNumber = await client.getBlockNumber();
      document.getElementById('blockNumber').textContent = blockNumber.toString();
    }
    
    window.addEventListener('DOMContentLoaded', init);
  </script>
</head>
<body>
  <h1>Tevm Example</h1>
  <div>
    <h2>Current Block Number</h2>
    <p id="blockNumber">Loading...</p>
  </div>
</body>
</html>
`;