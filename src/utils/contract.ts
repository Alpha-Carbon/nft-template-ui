import { ethers, BigNumber } from 'ethers'

export interface ContractState {
    auctionStarted: BigNumber
    price: BigNumber
    forSale: BigNumber[]
}

export async function getContractState(
    contract: ethers.Contract
): Promise<ContractState> {
    console.log('querying contract...',contract)
    const [auctionStarted, price, forSale] = await Promise.all([
        contract.auctionStarted(),
        contract.currentPrice(),
        contract.getForSale(),
        // contract.tokenURI(BigNumber.from(253)),
    ])
    // const nft = await contract.tokenURI();
    console.log(auctionStarted, price, forSale);
    return {
        auctionStarted,
        price,
        forSale,
    }
}

export async function updatePrice(
    contract: ethers.Contract
): Promise<[BigNumber, BigNumber]> {
    return await Promise.all([
        contract.auctionStarted(),
        contract.currentPrice(),
    ])
}
