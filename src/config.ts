export const MAINNET = 1
export const ROPSTEN = 3
export const KOVAN = 42
export const RINKEBY = 4
export const AMINO = 31337
export const GETH_DEV = 1337
export const supportedChains = [
    MAINNET,
    // ROPSTEN,
    // KOVAN,
    RINKEBY,
    // AMINO,
    GETH_DEV,
]

type Config = {
    contractAddress?: string
}

const config = {
    mainnet: {
        contractAddress: '0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
    },
    ropsten: {
        contractAddress: undefined,
    },
    kovan: {
        contractAddress: undefined,
    },
    rinkeby: {
        contractAddress: '0xC628eCbAf90Ab0062516ca556c0DE9b382a67BbD',
    },
    amino: {
        contractAddress: undefined,
    },
    gethDev: {
        contractAddress: '0xF5F4Db3541Dd8fA6D39b75f449f3A3aC7B3F0B83',
    },
}

export default function Configure(chainId: number): Config {
    switch (chainId) {
        case MAINNET:
            return config.mainnet
        case ROPSTEN:
            return config.ropsten
        case KOVAN:
            return config.kovan
        case RINKEBY:
            return config.rinkeby
        case AMINO:
            return config.amino
        case GETH_DEV:
            return config.gethDev
        default:
            return config.mainnet
    }
}
