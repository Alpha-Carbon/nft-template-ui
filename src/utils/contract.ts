import { ethers, BigNumber } from 'ethers'

export interface ContractState {
    // auctionStarted: BigNumber
    price: BigNumber
    // forSale: BigNumber[]
}

export async function getContractState(
    contract: ethers.Contract
): Promise<ContractState> {
    console.log('querying contract...',contract)
    const [price] = await Promise.all([
        contract.currentPrice(),
        // contract.getForSale(),
    ])
    return {
        price,
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
