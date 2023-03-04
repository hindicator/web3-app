import { ethers, getDefaultProvider } from 'ethers'
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers/types';
import { useEffect, useReducer, useRef, useState } from 'react';
// import { Garen__factory, Garen } from '../../../../solidity/typechain-types';
import * as Garen from '../assets/Garen.json'

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export type Wallet = {
    balance: string;
    isConnected: boolean;
    contract: Contract | undefined;
    getBalance: () => Promise<void>;
    getCount: () => Promise<number>;
    connectToWallet: () => Promise<void>;
    toggleSaleState: () => Promise<void>;
    mint: () => Promise<any>
}

export function useWallet(): Wallet {
    const [signer, setSigner] = useState<JsonRpcSigner>();
    const [contract, setContract] = useState<Contract>();
    const [balance, setBalance] = useState<string>('0.0');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [provider, setProvider] = useState<BrowserProvider>();
    const [account, setAccount] = useState<string>('');
    const [address, setAddress] = useState<string>('');


    useEffect(() => {
        if (window.ethereum === undefined) {
            setProvider(ethers.getDefaultProvider(0) as BrowserProvider)
        } else {
            setProvider(new ethers.BrowserProvider(window.ethereum));
            setIsConnected(true);
        }
    }, [window.ethereum])

    useEffect(() => {
        initWallet(provider!)
            .then((res) => {
                const { signer, balance, contract, address } = res;
                setSigner(signer);
                setBalance(balance ?? '');
                setContract(contract);
                setAddress(address ?? '');
            })
            .catch((err) => console.log(err));
    }, [provider])

    const getBalance = async () => {
        console.log(provider)
        console.log(!provider)
        if (!provider) {
            return;
        }
        
        const updatedBalance = await provider.getBalance(account);
        
        setBalance(ethers.formatEther(updatedBalance));
        console.log(balance)
    }
    const connectToWallet = async () => {
        console.log(provider)
        if (!provider) {
            return;
        }
        
        const newSigner = await provider.getSigner();
        const updatedAccount = await newSigner.getAddress();
        setAccount(updatedAccount)
    }

    const mint = async () => {
        if (!contract) {
            return;
        }
        console.log('contract:')
        console.log(contract)
        const mintPrice = await contract?.MINT_PRICE();
        return await contract.mint({ value: mintPrice });
    }
    const getCount = async () => {
        const updatedContract = new ethers.Contract(CONTRACT_ADDRESS, Garen.abi, signer)
        setContract(updatedContract)
        if (!contract) {
            return 0;
        }
        const countNew = await contract.count();
        console.log(countNew)
        return countNew;
    }
    const toggleSaleState = async () => {
        if (!contract) {
            return;
        }
        await contract.toggleSaleState();
    }



    return {
        balance,
        isConnected,
        contract,
        getBalance,
        connectToWallet,
        getCount,
        mint,
        toggleSaleState
    }
}

async function initWallet(provider: BrowserProvider) {
    if(!provider){
        return {};
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Garen.abi);
    const address = await signer.getAddress();
    const updatedBalance = await provider.getBalance(address);
    const balance = ethers.formatEther(updatedBalance);

    return {
        signer,
        address,
        contract,
        balance,
    }
}