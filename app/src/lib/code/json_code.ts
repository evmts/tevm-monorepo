export const code = `{
  "name": "Tevm Configuration",
  "version": "1.0.0",
  "description": "Example configuration for Tevm",
  "fork": {
    "url": "https://eth.llamarpc.com",
    "blockNumber": 14000000
  },
  "accounts": [
    {
      "address": "0x1234567890123456789012345678901234567890",
      "balance": "1000000000000000000",
      "privateKey": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    }
  ],
  "mining": {
    "mode": "interval",
    "interval": 5000
  },
  "logging": {
    "level": "debug"
  }
}
`;