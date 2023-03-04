import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import Driver from "./Driver";

// @ethersproject/abi
describe("Garen Contract", () => {
    const driver = new Driver();


    beforeEach(() => driver.init());

    it("should set the balance of a wallet to 10 ether", async () => {
        let balance = await driver.get.balance();

        expect(balance).to.equal(0);
        const address = await driver.get.address();

        await driver.set.balance(address, 10);
        balance = await driver.get.balance();
        expect(balance).to.equal(10);
    })

    it("should try to mint when sale is not on and get an error ", async () => {
        const address = await driver.get.address();
        await driver.set.balance(address, 10);
        const mintPrice = await driver.get.mintPrice();

        await expect(driver.when.mint(mintPrice)).to.be.revertedWith("Sale is not available");
    })

    it("should mint and reduce available mints by 1", async () => {
        const address = await driver.get.address();
        await driver.set.balance(address, 10);
        const mintPrice = await driver.get.mintPrice();
        
        await driver.when.toggleSaleState();
        await driver.when.mint(mintPrice)

        const count = await driver.get.count();
        expect(count).to.equal(1);

    });

    it("should not be able to mint more than 2 items", async () => {
        const address = await driver.get.address();
        await driver.set.balance(address, 10);
        const mintPrice = await driver.get.mintPrice();
        
        await driver.when.toggleSaleState();
        await driver.when.mint(mintPrice);
        await driver.when.mint(mintPrice);

        await expect(driver.when.mint(mintPrice)).to.be.revertedWith("Acceded the maximum amount of mints per person")
    });

    xit("should add a mint to a person with a given walletId", () => {
    });
    // Best testnet
})