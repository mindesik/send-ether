# Ask for Ether

Ask to transfer some ether via http.
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
