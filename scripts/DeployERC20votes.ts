import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";

dotenv.config();

const TOKENS_MINTED = ethers.utils.parseEther("1");

async function main() {

    // Infrastrucutre options
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,

    };

    // connect to provider through wallet
    const provider = ethers.getDefaultProvider("goerli", options);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");

    // wallet address & balance 
    console.log(`Using address ${wallet.address}`);
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));

    // check if eth balance sufficient
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error('Not enough Eth!')
    };

    // deploying contract 
    const MyTokenContractFactory = new MyToken__factory(signer);
    const MyTokenContract = await MyTokenContractFactory.deploy();
    await MyTokenContract.deployed();
    console.log(`MyToken contract was deployed at the address of ${MyTokenContract.address}\n`);

    // checking total supply
    const totalSupply = await MyTokenContract.totalSupply();
    console.log(`The initial totalSupply of the contract after deployment is ${totalSupply}\n`);

    // Minting token
    console.log(`Miniting new token for Acc1 \n`)
    const mintTx = await MyTokenContract.mint(wallet.address, TOKENS_MINTED);
    await mintTx.wait();

    // check total supply
    const totalSupplyAfter = await MyTokenContract.totalSupply();
    console.log(`total supply of this contract after minting ${ethers.utils.formatEther(totalSupplyAfter)}\n`);

    // check voting power of acc1 
    const acc1InitialVotingPowerAfterMint = await MyTokenContract.getVotes(wallet.address);
    console.log(`Voting power of acc1: ${acc1InitialVotingPowerAfterMint}\n`);

    // Self-delegation of acc1 to acc1 
    console.log(`Delegating from acc1 to acc1... \n`);
    const delegateTx = await MyTokenContract.connect(signer).delegate(wallet.address);
    await delegateTx.wait();

    // Voting power after self-delgation 
    console.log(`Voting power after self-delgation \n`);
    const acc1VotingPowerAfterDelegate = await MyTokenContract.getVotes(wallet.address);
    console.log(`Voting power of acc1: ${acc1VotingPowerAfterDelegate}\n`);

    const block = await ethers.provider.getBlock("latest");
    console.log(`Block Number ${block.number}`);

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});   