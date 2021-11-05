import React, { useEffect, useContext, useState } from 'react'
import { ethers, providers } from 'ethers'
import { API, Wallet, Ens } from 'bnc-onboard/dist/src/interfaces'

import { ContractState, getContractState, updatePrice } from '../utils/contract'
import { initOnboard } from '../utils/initOnboard'
import Abi from '../abi/MemeNumbersAbi.json'
import Config from '../config'

interface ContextData {
    address?: string
    ens?: Ens
    network?: number
    balance?: string
    wallet?: Wallet
    onboard?: API
    contractState?: ContractState
    contract?: ethers.Contract
    defaultContract: ethers.Contract
}

interface ContextActions {
    ready: () => Promise<boolean> // function as property declaration
    disconnect: () => void
}

type Context = [ContextData, ContextActions]

let defaultProvider: providers.JsonRpcProvider = new providers.InfuraProvider(1)
let defaultContract = new ethers.Contract(
    Config(1).contractAddress!,
    Abi,
    defaultProvider
)
let provider: providers.JsonRpcProvider | undefined
const Web3Context = React.createContext<Context>([
    { defaultContract },
    {
        ready: async () => {
            return false
        },
        disconnect: () => {},
    },
])
export const Web3Provider: React.FC<{}> = ({ children }) => {
    const [address, setAddress] = useState<string>()
    const [ens, setEns] = useState<Ens>()
    const [network, setNetwork] = useState<number>()
    const [balance, setBalance] = useState<string>()
    const [wallet, setWallet] = useState<Wallet>()
    const [onboard, setOnboard] = useState<API>()
    const [contractState, setContractState] = useState<ContractState>()
    const [activeContract, setActiveContract] = useState<ethers.Contract>()

    useEffect(() => {
        const onboard = initOnboard({
            address: setAddress,
            ens: setEns,
            network: setNetwork,
            balance: setBalance,
            wallet: (wallet: Wallet) => {
                // console.log('wallet set')
                if (wallet.provider) {
                    setWallet(wallet)

                    provider = new ethers.providers.Web3Provider(
                        wallet.provider
                    )

                    window.localStorage.setItem('selectedWallet', wallet.name!)
                } else {
                    provider = undefined
                    setActiveContract(undefined)
                    setWallet(undefined)
                }
            },
        })
        setOnboard(onboard)

        // Get contract data and setup listeners on default contract
        ;(async () => {
            const contractState = await getContractState(defaultContract)
            defaultContract.on('Refresh', async () => {
                let currentState = await getContractState(defaultContract)
                setContractState(currentState)
            })
            setContractState(contractState)
        })()

        // Setup price refresh on defaultProvider
        defaultProvider.on('block', async (_block) => {
            try {
                // console.log(`mainnet - ${block}!`)
                const [auctionStarted, price] = await updatePrice(
                    defaultContract
                )
                if (contractState && contractState.price > price)
                    console.log('NEW BATCH, SHOULD FORCE RELOAD')
                setContractState((prev: ContractState | undefined) => {
                    return prev ? { ...prev, auctionStarted, price } : prev
                })
            } catch (e) {
                console.error(`contract error: ${e}`)
            }
        })
    }, [])

    useEffect(() => {
        const previouslySelectedWallet = window.localStorage.getItem(
            'selectedWallet'
        )
        if (previouslySelectedWallet && onboard) {
            ;(async () => {
                await onboard.walletSelect(previouslySelectedWallet)
                await onboard.walletCheck()
            })()
        }
    }, [onboard])

    useEffect(() => {
        ;(async () => {
            console.log('network changed: ', network)
            if (!network || !onboard) return

            onboard.config({ networkId: network })
            defaultContract.removeAllListeners()
            defaultProvider.removeAllListeners()
            defaultProvider = new providers.InfuraProvider(network)
            defaultContract = new ethers.Contract(
                Config(network).contractAddress!,
                Abi,
                defaultProvider
            )

            //get contract data and set listener
            const contractState = await getContractState(defaultContract)
            defaultContract.on('Refresh', async () => {
                let currentState = await getContractState(defaultContract)
                setContractState(currentState)
            })
            setContractState(contractState)

            // Setup price refresh on defaultProvider
            defaultProvider.on('block', async (_block) => {
                // console.log(`${network} - ${block}!`)
                try {
                    const [auctionStarted, price] = await updatePrice(
                        defaultContract
                    )
                    setContractState((prev: ContractState | undefined) => {
                        return prev ? { ...prev, auctionStarted, price } : prev
                    })
                } catch (e) {
                    console.log('CONTRACT ERROR')
                }
            })

            if (wallet) {
                let p: providers.JsonRpcProvider = new ethers.providers.Web3Provider(
                    wallet.provider
                )
                // console.log('resetting contract', provider.getSigner())
                // console.log('wallet provider', wallet!.provider)
                // console.log('wallet signer', wallet!.provider.getSigner)
                let activeContract = new ethers.Contract(
                    Config(network).contractAddress!,
                    Abi,
                    p.getSigner()
                )
                // console.log(activeContract)
                setActiveContract(activeContract)
            }
            setNetwork(network)
        })()
    }, [onboard, network, wallet])

    // console.log(wallet?.provider)

    async function readyToTransact() {
        if (!provider) {
            //#HACK if provider is set, onboard should be set.
            const walletSelected = await onboard!.walletSelect()
            if (!walletSelected) return false
        }

        return await onboard!.walletCheck()
    }

    const disconnectWallet = () => {
        if (onboard) {
            try {
                onboard.walletReset()
            } catch (e) {
                console.error(e)
            }
            setBalance(undefined)
            setAddress(undefined)
            window.localStorage.removeItem('selectedWallet')
        }
    }

    return (
        <Web3Context.Provider
            value={[
                {
                    address,
                    ens,
                    network,
                    balance,
                    wallet,
                    onboard,
                    contractState,
                    contract: activeContract,
                    defaultContract,
                },
                { ready: readyToTransact, disconnect: disconnectWallet },
            ]}
        >
            {children}
        </Web3Context.Provider>
    )
}

export default function useWeb3() {
    return useContext(Web3Context)
}
