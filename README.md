# Homework Week 3 

Contract information: 
TOKENIZED_BALLOT_CONTRACT = "0x946FdaC26F183FF2180Fc4E187A926DFB6806300";
ERC20_TOKEN_CONTRACT = '0xCA6D344B981B091F95E8c9C14bfbBeE30145EF7B';

Before commencing the homework we outlined the following steps which have to be conducted: 
===============================================
During class we wrote the contracts: 
1) Write deployment script to deploy ERC20votes.ts #DONE
2) Write a deployment script for TokenizedBallot.ts
    > Note: Sequence matter as you need the deployment address of the ERC20

Once deployed write separate script that interact with the deployed contract to: 
3) give voting tokens, 
4) delegating voting power, 
5) casting votes & checking vote power 
6) querying results

Once completed:
7) Document the result: Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
8) Share your code in a github repo in the submission form

================================================

Transaction hash references
1) The deployment script DeployERC20Votes.ts does the following: 
Deployed ERCvotes.sol - Tx-hash:0xb2025e32dbb75d673481f3025a51ea32f48e377dd25ea4257ab6f415a2babe83
Mint 1 voting token for the deployer address - Tx-hash: 0x0ad96bf5d1172fe0cf24336bb0f886d5d15575221b8416f3e2b26cda2a718d2a
Self-delegates to deployer - Tx-hash: 0xf2bbeb38ab62bf2d5f71c491b2ab0b440a095d323be555dd9e115248c8d4b750
2) The deployment script DeployTokenizedBallot.ts does the following: 
Deployed TokenizedBallot.sol - Tx-hash: 0x7d268d0c75cb278753ca2f2e9a7ef9c4b0c6347076076ee90a9e4bd5d3e24b2f
3) InteractGiveVotingPower.ts mints new voting token for 2 addresses: 
Address 1 - Tx-hash: 0xd3d75ed244b073b58dcd901e1b96996489a231aea3e87829aebffc8dda0a0c37
Address 2 - Tx-hash: 0xf4b715ee8549c660778a6b6c1829ffdf07789370c72c9d32586da0cb422b2f04
4) Address 1 delgates voting power to deployer address: 
Address 1 deployed to deployer address - tx-hash: 0xdc8d18b84afddc59fcdea8298284d6fbe4e514e4aae1baa756097836ac7e50f5
5) Deployer cast vote on Proposal 2 by interaction with TokenizedBallot.sol see script InteractCastVote.ts
Partial vote 1 - Tx-hash: 0xb909f30e34ed88a1ff200d70cd3fa51f61da400d54d09e6bae384858df25f5a4
Partial vote 2 - Tx-hash:0x93258f9105c9db7b22cba8ac2f9c7cea7157e1619c478a9d341b9a4ba1f9747a
6) See script InteractCastVote.ts

