import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const TOKENS_MINTED = ethers.utils.parseEther("1");

async function main() {
    const [deployer, acc1, acc2] = await ethers.getSigners();

    // deploying contract 
    const MyTokenContractFactory = await ethers.getContractFactory("MyToken");
    const MyTokenContract = await MyTokenContractFactory.deploy();
    await MyTokenContract.deployed();
    console.log(`MyToken contract was deployed at the address of ${MyTokenContract.address}\n`);

    // checking total supply
    const totalSupply = await MyTokenContract.totalSupply();
    console.log(`The initial totalSupply of the contract after deployment is ${totalSupply}\n`);

    // Minting token
    console.log(`Miniting new token for Acc1 \n`)
    const mintTx = await MyTokenContract.mint(acc1.address, TOKENS_MINTED);
    await mintTx.wait();

    // check total supply
    const totalSupplyAfter = await MyTokenContract.totalSupply();
    console.log(`total supply of this contract after minting ${ethers.utils.formatEther(totalSupplyAfter)}\n`);

    // check account balance after mint
    const acc1BalanceAfterMint = await MyTokenContract.balanceOf(acc1.address);
    console.log(`Balance of acc1 ${ethers.utils.formatEther(acc1BalanceAfterMint)}\n`);

    // check voting power of acc1 
    const acc1InitialVotingPowerAfterMint = await MyTokenContract.getVotes(acc1.address);
    console.log(`Voting power of acc1: ${acc1InitialVotingPowerAfterMint}\n`);

    // Self-delegation of acc1 to acc1 
    console.log(`Delegating from acc1 to acc1... \n`);
    const delegateTx = await MyTokenContract.connect(acc1).delegate(acc1.address);
    await delegateTx.wait();

    // Voting power after self-delgation 
    console.log(`Voting power after self-delgation \n`);
    const acc1VotingPowerAfterDelegate = await MyTokenContract.getVotes(acc1.address);
    console.log(`Voting power of acc1: ${acc1VotingPowerAfterDelegate}\n`);


    const currentBlock = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock.number}\n`);

    // focing to our set up to mine blocks 
    //// one - additonal block 
    const mintTx2 = await MyTokenContract.mint(acc2.address, TOKENS_MINTED);
    await mintTx2.wait();
    const currentBlock2 = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock2.number}\n`);

    //// one - additonal block 
    const mintTx3 = await MyTokenContract.mint(acc2.address, TOKENS_MINTED);
    await mintTx3.wait();
    const currentBlock3 = await ethers.provider.getBlock("latest");
    console.log(`The current block number is ${currentBlock3.number}\n`);

    // view voting power across blocks 
    const pastVotes = await Promise.all([
        MyTokenContract.getPastVotes(acc1.address, 4),
        MyTokenContract.getPastVotes(acc1.address, 3),
        MyTokenContract.getPastVotes(acc1.address, 2),
        MyTokenContract.getPastVotes(acc1.address, 1),
        MyTokenContract.getPastVotes(acc1.address, 0),

    ])
    console.log({ pastVotes });



};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});   