# web3-core

Core web3 utilities and components for interacting with EVM-compatible blockchains.

## Components

### Multicaller

The `Multicaller` is a utility class that allows you to batch multiple contract calls into a single transaction using the [Multicall3](https://github.com/mds1/multicall) contract. This is useful for reducing the number of RPC calls and transactions needed to interact with multiple contracts.

> **Important**: When using Multicaller, note that any contract method using `msg.sender` will see the Multicall3 contract address as the sender, not the user's address. This is because the Multicall3 contract is the one actually executing each call. Design your contract interactions accordingly.

#### Features

-   Batch multiple contract calls into a single transaction
-   Support for allowing specific calls to fail without reverting the entire transaction
-   Automatic deployment address resolution based on chain ID
-   TypeScript support with full type safety

#### Installation

```bash
npm install @fusyona/web3-core
```

#### Usage

1. Basic Usage:

```typescript
import { Multicaller, to } from "@fusyona/web3-core";

// Initialize Multicaller with a provider (deployment is automatically detected from connected network)
const multicaller = await Multicaller.fromProvider(provider);

// Execute all calls in a single transaction
const tx = await multicaller.multicall(
    to(tokenA, "transfer", [recipient, amount]),
    to(tokenB, "transfer", [recipient, amount]),
);
```

2. With Signer:

```typescript
// Use a specific signer for the transaction
await multiCaller
    .withSigner(signerAddress)
    .multicall(to(tokenA, "transfer", [recipient, amount]), to(tokenB, "transfer", [recipient, amount]));
```

3. Allowing Failures:

```typescript
// The third parameter (true) allows this call to fail without reverting the transaction
await multicaller.withSigner(signerAddress).multicall(
    to(tokenA, "transfer", [recipient, amount]),
    to(tokenB, "mint", [recipient], true), // This call can fail
);
```

#### API Reference

##### `Multicaller`

-   `static fromProvider(provider: Provider, overrideAddress?: Address)`

    -   Creates a new Multicaller instance from an ethers Provider
    -   Automatically detects the correct Multicall3 contract address for the network. You can optionally use a custom address

-   `withSigner(address: Address)`

    -   Returns a new Multicaller instance that will use the specified signer address

-   `multicall(...calls: Call[])`
    -   Executes multiple contract calls in a single transaction
    -   Returns a ContractTransactionResponse

##### `to` Helper Function

The `to` helper function provides full type safety for contract interactions:

-   `contract`: Accepts any ethers Contract instance. The function will infer all available methods from the contract's ABI
-   `method`: Type-safe autocomplete for all methods available in the contract
-   `args`: Type checking for method parameters, ensuring you pass the correct types and number of arguments
-   `allowFailure`: Optional boolean to allow the specific call to fail without reverting the entire multicall

The function leverages TypeScript's type system to catch errors at compile time, such as:

-   Calling non-existent contract methods
-   Passing wrong argument types
-   Missing required parameters
-   Passing extra parameters

#### Supported Networks

The Multicaller is deployed and ready to use on the following networks:

-   Sei Mainnet (Chain ID: 1329)
-   BSC Testnet (Chain ID: 97)
-   Sei Testnet (Chain ID: 1328)
-   Sei Devnet (Chain ID: 713715)
-   Base Sepolia (Chain ID: 84532)
-   Sepolia (Chain ID: 11155111)

The deployment addresses are automatically detected based on the connected network. You can optionally override the address using the `overrideAddress` parameter in `fromProvider`.

#### Examples

1. Multiple Token Transfers:

```typescript
await multicaller
    .withSigner(signerAddress)
    .multicall(to(tokenA, "transfer", [recipient, amount]), to(tokenB, "transfer", [recipient, amount]));
```

2. Multiple Token Mints:

```typescript
await multicaller
    .withSigner(signerAddress)
    .multicall(to(tokenA, "mint", [recipient, amount]), to(tokenB, "mint", [recipient, amount]));
```

3. Mixed Token Operations:

```typescript
await multicaller
    .withSigner(signerAddress)
    .multicall(
        to(tokenA, "transfer", [recipient, amount]),
        to(tokenB, "mint", [recipient, amount]),
        to(tokenC, "burn", [amount]),
    );
```
