// import { ethers } from "ethers"; //for testnet deployment
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { TokenizedBallot__factory } from "../typechain-types";

dotenv.config();
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const ERC20_TOKEN_ADDRESS = '0xCA6D344B981B091F95E8c9C14bfbBeE30145EF7B';


// Convert proposal names to byte array
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {

    // Testnet deployment
    // ================== //

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

    // logging 
    console.log("Deploying TokenizedBallot contract");
    console.log("Proposals: ");
    PROPOSALS.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    // get _referenceblock
    // const referenceBlock = await ethers.provider.getBlock(7732518);
    // console.log(`Reference Block is: ${referenceBlock.number}`)

    // deploy tokenizedBallotContract 
    const tokenizedBallotFactory = new TokenizedBallot__factory(signer);
    const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS),
        ERC20_TOKEN_ADDRESS,
        7732669
    );
    await tokenizedBallotContract.deployed();
    console.log(`Contact Address: ${tokenizedBallotContract.address}`);


    // Check if prposal have been deployed
    for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await tokenizedBallotContract.proposals(index);
        const name = ethers.utils.parseBytes32String(proposal.name);
        console.log({ index, name, proposal });
    };

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});