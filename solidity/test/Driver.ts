import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { Garen } from '../typechain-types/'
import { BigNumber } from "ethers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect } from "chai";
// import { Contract } from "ethers/src.ts";

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
const ONE_GWEI = 1_000_000_000;
const lockedAmount = ONE_GWEI;
export default class Driver {
    garen!: Garen;
    unlockTime!: number;
    constructor() {
    }

    async init() {
        const factory = await ethers.getContractFactory("Garen");

        const [owner, otherAccount] = await ethers.getSigners();
        // console.log(owner, otherAccount)
        this.garen = await factory.deploy();
        this.unlockTime = (await helpers.time.latest()) + ONE_YEAR_IN_SECS;
    }

    when = {
        mint: async (mintPrice: BigNumber) => {
            return this.garen.mint({ value: mintPrice })
        },
        toggleSaleState: async () => this.garen.toggleSaleState(),
    }

    get = {
        balance: async (): Promise<number> => {
            const balanceIn = await ethers.provider.getBalance(this.garen.address);
            return Number(ethers.utils.formatEther(balanceIn));
        },
        mintPrice: async () => this.garen.MINT_PRICE(),
        totalMintLeft: async () => this.garen.MAX_SUPPLY,
        address: async () => this.garen.address,
        count: async () => this.garen.count(),
        isSaleOn: async () => this.garen.isSaleOn()
    }

    set = {
        balance: async (address: string, amount: number) => {
            const formattedAmount = ethers.utils.parseEther(`10`)
            await helpers.setBalance(address, formattedAmount);
        },
    }
}