import React, {
    useEffect,
    useContext,
    useState,
    useRef,
    Dispatch,
    SetStateAction,
} from "react";
import { BigNumber, ContractReceipt, ContractTransaction, ethers, providers } from "ethers";
import { API, Wallet, Ens } from "bnc-onboard/dist/src/interfaces";

import { ContractState, getContractState, updatePrice } from '../utils/contract'
import { initOnboard } from '../utils/initOnboard'
import Abi from '../abi/NftTemplateAbi.json'
import Config, { GETH_DEV, AMINOX_TESTNET, supportedChains } from '../config'
import delay from "../utils/delay";

interface ContextData {
    address?: string;
    ens?: Ens;
    network?: number;
    balance?: string;
    wallet?: Wallet;
    onboard?: API;
    contractState?: ContractState;
    contract?: ethers.Contract;
    provider?: providers.JsonRpcProvider | undefined;
    tokenBalance?: number;
    defaultContract: ethers.Contract;
}

interface ContextActions {
    ready: () => Promise<boolean>; // function as property declaration
    disconnect: () => void;
}

type Context = [ContextData, ContextActions];

// let defaultProvider: providers.JsonRpcProvider = new providers.InfuraProvider(
//     1
// );
let defaultProvider: providers.JsonRpcProvider = new providers.JsonRpcProvider(
    "https://aminoxtestnet.node.alphacarbon.network/",
    AMINOX_TESTNET,
);
// let defaultContract = new ethers.Contract(
//     Config(1).contractAddress!,
//     Abi,
//     defaultProvider
// );
let defaultContract = new ethers.Contract(
    Config(AMINOX_TESTNET).contractAddress!,
    Abi,
    defaultProvider
);
let provider: providers.JsonRpcProvider | undefined;
const Web3Context = React.createContext<Context>([
    { defaultContract },
    {
        ready: async () => {
            return false;
        },
        disconnect: () => { },
    },
]);
export const Web3Provider: React.FC<{}> = ({ children }) => {
    const [address, setAddress] = useState<string>();
    const [ens, setEns] = useState<Ens>();
    const [network, setNetwork] = useState<number>();
    const [balance, setBalance] = useState<string>();
    const [wallet, setWallet] = useState<Wallet>();
    const [onboard, setOnboard] = useState<API>();
    const [contractState, setContractState] = useState<ContractState>();
    const [activeContract, setActiveContract] = useState<ethers.Contract>();
    const [tokenBalance, setTokenBalance] = useState<number>();


    //callback anchors
    const contractStateRef = useRef<ContractState>();
    contractStateRef.current = contractState;
    const getCurrentState = () => {
        return contractStateRef.current;
    };

    useEffect(() => {
        const onboard = initOnboard({
            address: setAddress,
            ens: setEns,
            network: setNetwork,
            balance: setBalance,
            wallet: (wallet: Wallet) => {
                // console.log('wallet set')
                if (wallet.provider) {
                    setWallet(wallet);

                    provider = new ethers.providers.Web3Provider(wallet.provider);

                    window.localStorage.setItem("selectedWallet", wallet.name!);
                } else {
                    provider = undefined;
                    setActiveContract(undefined);
                    setWallet(undefined);
                }
            },
        });
        setOnboard(onboard);

        // Get contract data and setup listeners on default contract
        subscribeRefresh(defaultContract, setContractState);

        // Setup price refresh on defaultProvider
        subscribeState(
            defaultProvider,
            defaultContract,
            getCurrentState,
            setContractState,
        );
    }, []);

    useEffect(() => {
        const previouslySelectedWallet =
            window.localStorage.getItem("selectedWallet");
        if (previouslySelectedWallet && onboard) {
            (async () => {
                await onboard.walletSelect(previouslySelectedWallet);
                await onboard.walletCheck();
            })();
        }
    }, [onboard]);

    useEffect(() => {
        (async () => {
            console.log("network changed: ", network);
            if (!network || !onboard) return;

            if (!supportedChains.includes(network)) {
                setActiveContract(undefined)
                return
            }

            onboard.config({ networkId: network });
            defaultContract.removeAllListeners();
            defaultProvider.removeAllListeners();
            // if (network == GETH_DEV) {
            //     defaultProvider = new providers.JsonRpcProvider(
            //         "http://192.168.50.147:8545",
            //         network
            //     );
            // } else if (network == AMINOX_TESTNET) {
            //     console.log('conneted aminox');
            //     defaultProvider = new providers.JsonRpcProvider(
            //         "https://aminoxtestnet.node.alphacarbon.network/",
            //         network
            //     );
            // }
            // else if (network == MAINNET || network == RINKEBY) {
            //     defaultProvider = new providers.InfuraProvider(network);
            // }
            // else {
            //     defaultProvider = new providers.JsonRpcProvider(
            //         undefined,
            //         network
            //     );
            // }
            defaultContract = new ethers.Contract(
                Config(network).contractAddress!,
                Abi,
                defaultProvider
            );

            // Get contract data and setup listeners on default contract
            // subscribeRefresh(defaultContract, setContractState);

            // Setup price refresh on defaultProvider
            subscribeState(
                defaultProvider,
                defaultContract,
                getCurrentState,
                setContractState,
            );

            if (wallet) {
                let p: providers.JsonRpcProvider = new ethers.providers.Web3Provider(
                    wallet.provider
                );
                // console.log('resetting contract', provider.getSigner())
                // console.log('wallet provider', wallet!.provider)
                // console.log('wallet signer', wallet!.provider.getSigner)
                let activeContract = new ethers.Contract(
                    Config(network).contractAddress!,
                    Abi,
                    p.getSigner()
                );
                // console.log(activeContract)
                setActiveContract(activeContract);
            }
            setNetwork(network);
        })();
    }, [onboard, network, wallet]);

    useEffect(() => {
        if (!address || !defaultContract || !defaultProvider) {
            return
        } else {
            defaultProvider.removeAllListeners();
            defaultProvider.on('block', async () => {
                try {
                    const b = await updateBalance(address, defaultContract);
                    if (tokenBalance !== b) {
                        setTokenBalance(b);
                    }
                } catch (e) {
                    console.log(e)
                }
            });
            subscribeState(
                defaultProvider,
                defaultContract,
                getCurrentState,
                setContractState,
            );
        }
    }, [address])


    // console.log(wallet?.provider)

    async function readyToTransact() {
        if (!provider) {
            //#HACK if provider is set, onboard should be set.
            const walletSelected = await onboard!.walletSelect();
            if (!walletSelected) return false;
        }

        return await onboard!.walletCheck();
    }

    const disconnectWallet = () => {
        defaultContract && defaultContract.removeAllListeners();
        defaultProvider && defaultProvider.removeAllListeners();
        if (onboard) {
            try {
                onboard.walletReset();
            } catch (e) {
                console.error(e);
            }
            console.log('disconnect')
            setAddress(undefined);
            setBalance(undefined);
            setTokenBalance(undefined);
            window.localStorage.removeItem("selectedWallet");
        }
    };

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
                    provider: defaultProvider,
                    tokenBalance
                },
                { ready: readyToTransact, disconnect: disconnectWallet },
            ]}
        >
            {children}
        </Web3Context.Provider>
    );
};

async function subscribeRefresh(
    contract: ethers.Contract,
    setContractState: Dispatch<SetStateAction<ContractState | undefined>>
) {
    try {
        const contractState = await getContractState(defaultContract);

        // contract.on("Refresh", async () => {
        //     let currentState = await getContractState(defaultContract);
        //     setContractState(currentState);
        // });
        setContractState(contractState);
    } catch (e) {
        // console.log(e);
    }
}

async function subscribeState(
    provider: providers.JsonRpcProvider,
    contract: ethers.Contract,
    getCurrentState: () => ContractState | undefined,
    setContractState: Dispatch<SetStateAction<ContractState | undefined>>,
) {
    try {
        // console.log(`current price ${currentState?.price}, new price ${price}`);

        //#HACK, in case refresh event comes later than the last auto refresh from block updates
        //we should force update the forsale and auctionstarted (a full requery)
        provider.on('block', async () => {
            try {
                const currentState = getCurrentState();
                // await delay(2000);
                const total = await contract.totalSupply();
                if (currentState?.total && currentState?.total !== total) {
                    setContractState((prev: ContractState | undefined) => {
                        return prev ? { ...prev, total } : prev;
                    });
                }
            } catch (e) {
                // console.log(e);
            }
        })
    } catch (e) {
        console.error(`contract error: ${e}`);
    }
}

export async function updateTransaction(hash: string) {
    const transaction = await defaultProvider.getTransaction(hash);
    const receipt = await defaultProvider.getTransactionReceipt(hash);
    return { transaction, receipt };
}

export async function updateBalance(
    address: string,
    contract: ethers.Contract
): Promise<number> {
    return new Promise((resolve, reject) => {
        contract.balanceOf(address).then((b: BigNumber) => {
            resolve(Number(b._hex));
        }).catch((error: Error) => {
            reject(error)
        })
    })
}

export default function useWeb3() {
    return useContext(Web3Context);
}
