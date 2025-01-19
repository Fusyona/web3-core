import { NetworkConfigData } from "./types";

export default {
    polygonPos: {
        chainId: 137,
        rpcUrl: "https://polygon-mainnet.infura.io/v3/{PROVIDER_API_KEY}",
    },
    bsc: {
        chainId: 56,
        rpcUrl: "https://bsc-dataseed1.binance.org",
    },
    taraxa: {
        chainId: 841,
        rpcUrl: "https://rpc.mainnet.taraxa.io/",
        explorerUrl: "https://explorerUrl.mainnet.taraxa.io/",
    },
    nebula: {
        chainId: 1482601649,
        rpcUrl: "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
        explorerUrl: "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
    },
    telos: {
        chainId: 40,
        rpcUrl: "https://mainnet.telos.net/evm",
        explorerUrl: "https://www.teloscan.io",
    },
    coredao: {
        chainId: 1116,
        rpcUrl: "https://rpc.coredao.org/",
        explorerUrl: "https://scan.coredao.org/",
    },
    sei: {
        chainId: 1329,
        rpcUrl: "https://evm-rpc.sei-apis.com",
        explorerUrl: "https://seitrace.com/?chain=pacific-1",
    },

    sepolia: {
        chainId: 11155111,
        rpcUrl: "https://sepolia.infura.io/v3/7d2ecd41c400446585a5d7d8aa93c78d",
    },
    mumbai: {
        chainId: 80001,
        rpcUrl: "https://polygon-mumbai.infura.io/v3/{PROVIDER_API_KEY}",
    },
    bscTestnet: {
        chainId: 97,
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
    taraxaTestnet: {
        chainId: 842,
        rpcUrl: "https://rpc.testnet.taraxa.io/",
        explorerUrl: "https://explorerUrl.testnet.taraxa.io/",
    },
    nebulaTestnet: {
        chainId: 37084624,
        rpcUrl: "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet",
        explorerUrl: "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
    },
    telosTestnet: {
        chainId: 41,
        rpcUrl: "https://testnet.telos.net/evm",
        explorerUrl: "https://testnet.teloscan.io/",
    },
    coredaoTestnet: {
        chainId: 1115,
        rpcUrl: "https://rpc.test.btcs.network/",
        explorerUrl: "https://scan.test.btcs.network/",
    },
    seiTestnet: {
        chainId: 1328,
        rpcUrl: "https://evm-rpc-testnet.sei-apis.com/",
        explorerUrl: "https://seitrace.com/?chain=atlantic-2",
    },
    seiDevnet: {
        chainId: 713715,
        rpcUrl: "https://evm-rpc-arctic-1.sei-apis.com/",
        explorerUrl: "https://seitrace.com/?chain=arctic-1",
    },
    ternoaZkevmTestnet: {
        chainId: 752024,
        rpcUrl: "https://rpc.zkevm.ternoa.network",
        explorerUrl: "https://explorer.zkevm.ternoa.network",
    },
    baseSepolia: {
        chainId: 84532,
        rpcUrl: "https://sepolia.base.org",
        explorerUrl: "https://sepolia.basescan.org",
    },

    hardhat: {
        chainId: 31337,
        rpcUrl: "http://127.0.0.1:8545",
    },
} as const;
