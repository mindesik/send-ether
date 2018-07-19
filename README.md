# Send Ether

Ask to transfer some ether.
KOVAN testnet only!

## Configuration

`.env`:

```
INFURA_KEY=...
ACCOUNT_ADDRESS=0x...
PRIVATE_KEY=...
HTTP_PORT=1337
```

## Usage

`curl http://127.0.0.1:1337?address=0x...&value=0.01`

## Response

Success status code `200`:
```json
{"success": true, "tx": "https://kovan.etherscan.io/tx/0x..."}
```

Error status code `400`:
```json
{"success": false, "error": "Invalid address"}
```

Error status code `500`:
```json
{"success": false, "error": "Server error"}
```