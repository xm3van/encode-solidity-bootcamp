import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/ERC20Votes.sol/MyToken.json";

dotenv.config();

const DEPLOYER = "0xEB92E3D17fCc40513D14BC3b7E6AA47d93b68765";
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
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "");

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
    const contractInstance = new ethers.Contract(ERC20_TOKEN_CONTRACT, abi, signer);
    console.log(`Contract Instance: ${contractInstance.address}\n`)

    // delegate vote 
    console.log(`Delegating from Acc1 to deployer... \n`);
    const delegateTx = await contractInstance.connect(signer).delegate(DEPLOYER);
    await delegateTx.wait();

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});