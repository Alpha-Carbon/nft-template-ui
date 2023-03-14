import { ethers, BigNumber } from 'ethers'

export interface ContractState {
    // auctionStarted: BigNumber
    price: BigNumber
    total?: BigNumber
    name?: string
    // forSale: BigNumber[]
}

export async function getContractState(
    contract: ethers.Contract
): Promise<ContractState> {
    console.log('querying contract...',contract)
    const [price, total] = await Promise.all([
        contract.currentPrice(),
        contract.totalSupply(),
        // contract.getForSale(),
    ])
    return {
        price,
        total,
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
