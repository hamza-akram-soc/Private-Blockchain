const sha256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress= fromAddress;
        this.toAddress= toAddress;
        this.amount= amount;
    }
}
class Block {
    constructor( timestamp, transactions, previousHash=""){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash= previousHash;
        this.hash= this.calculateHash();
        this.nonce =0;
    }
    calculateHash(){
        return sha256( this.timestamp + this.previousHash + JSON.stringify(this.data)+ this.nonce).toString()
    }

    //Proof of Work 
    //This function add number of zero infront of end to match the combination system has to mint
    minedBlock(difficulty){
        while(this.hash.substring(0, difficulty)!==Array(difficulty +1).join("0"))
        {
            this.nonce++
            this.hash=this.calculateHash();
        }
        console.log ("New block mined " + this.hash);
        
    }
}
class Blockchain{

    constructor(){
        this.chain = [this.createGenisiBlock()];
        this.difficulty =2;
        this.pendingTransactions =[];
        this.miningReward= 100;
    }

    createGenisiBlock(){
        return new Block( "03/03/2023", "Genisis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash= this.getLatestBlock().hash;
    //     //newBlock.hash= newBlock.calculateHash();
    //     newBlock.minedBlock(this.difficulty)
    //     this.chain.push(newBlock);
    // }
    
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.minedBlock(this.difficulty);
        console.log("Block Mined!");

        this.chain.push(block);

        this.pendingTransactions= [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction (transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance =0;
        
        for(const block of this.chain){
            for (const trans of block.transactions){

                if (trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++)
        {
          const  currentBlock = this.chain[i];
          const  previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }

}
let myCoin = new Blockchain();

myCoin.createTransaction(new Transaction("address1", "address2", 20))
myCoin.createTransaction(new Transaction("address2", "address1", 10))

console.log("\nMining the Block...");
myCoin.minePendingTransactions("hamza-address");

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress("hamza-address"));

console.log("\nMining the Block Again...");
myCoin.minePendingTransactions("hamza-address");

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress("hamza-address"));
