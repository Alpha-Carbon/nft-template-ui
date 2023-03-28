import { ethers, BigNumber } from 'ethers'

export interface ContractState {
    // auctionStarted: BigNumber
    price: BigNumber
    total: BigNumber
    name?: string
    tokenBalance?: number
    // forSale: BigNumber[]
}

export async function getContractState(
    contract: ethers.Contract
): Promise<ContractState> {
    console.log('querying contract...', contract)
    const [price, total, name] = await Promise.all([
        contract.currentPrice(),
        contract.totalSupply(),
        contract.name(),
        // contract.getForSale(),
    ])
    return {
        price,
        total,
        name,
        // forSale,
    }
}

export async function updatePrice(
    contract: ethers.Contract
): Promise<[BigNumber]> {
    return await Promise.all([
        contract.currentPrice(),
    ])
}

