import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { abi } from "../artifacts/contracts/ITokenizedBallot.sol/ITokenizedBallot.json";


dotenv.config();

const XM3VAN = "0x198415CE9f54A0A7e23B51b5C6a07973CDcBad4B";
const itsurboy = "0x889EAE789177B319161397CDeCe70F0049dD9Add";
const TOKENIZED_BALLOT_CONTRACT = "0x946FdaC26F183FF2180Fc4E187A926DFB6806300";
const ERC20_TOKEN_CONTRACT = '0xCA6D344B981B091F95E8c9C14bfbBeE30145EF7B';
const TOKENS_MINTED = ethers.utils.parseEther("1");



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

    // get deployed contract instance
    const contractInstance = new ethers.Contract(TOKENIZED_BALLOT_CONTRACT, abi, signer);
    console.log(`Contract Instance: ${contractInstance.address}\n`)


    // checking voting power 
    const votePower = await contractInstance.connect(signer).votePower(signer.address);
    console.log(`voting power ${ethers.utils.formatEther(votePower)} of ${signer.address}\n`);

    //// check for winning proposal before
    const winningProposalBefore = await contractInstance.connect(signer).winnerName();
    const winningProposalBeforeFormatted = ethers.utils.parseBytes32String(winningProposalBefore);
    console.log({ winningProposalBeforeFormatted })


    // cast votes for proposal 2 
    //// all for vote for proposal 2 
    const voteTx = await contractInstance.connect(signer).vote(1, votePower.div(5));
    const voteTxReceipt = voteTx.wait();
    console.log(`VoteTx Receipts: ${voteTxReceipt}\n`);


    // query winning proposal 
    console.log(`Query Winning Proposal`);
    const winningProposalVotes = await contractInstance.winningProposal();
    const winningProposalName = await contractInstance.winnerName();

    console.log(`name of Proposal: ${ethers.utils.parseBytes32String(winningProposalName)}`);
    console.log(`No. of votes: ${winningProposalVotes}`);


};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});