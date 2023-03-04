const sha256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;

const ec= new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress= fromAddress;
        this.toAddress= toAddress;
        this.amount= amount;
    }

    calculateHash(){
        return sha256(this.fromAddress + this.toAddress + this.amount);
    }

    signTransactions(signKey){

        if(signKey.getPublic('hex')!== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets');
        }

        const TxHash = this.calculateHash();
        const sig = signKey.sign(TxHash, 'base64');
        this.signature= sig.toDER('hex');
    }

    isValid(){
        if (this.fromAddress===null) return true;
        if (!this.signature || this.signature.length === 0 )
        {
            throw new Error("There is no signature with this transaction");
        }

        const pubKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return pubKey.verify(this.calculateHash(), this.signature);
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

    hasValidTransactions(){
        for (const tx of this.transactions)
        {
            if(!tx.isValid()) return false;
        }
        return true;
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

        const rewardTx = new Transaction(null , 'miningRewardAddress', this.miningReward);
        this.pendingTransactions.push(rewardTx);
        
        let block = new Block(Date.now(),this.pendingTransactions);
        block.minedBlock(this.difficulty);
        console.log("Block Mined!");

        this.chain.push(block);

        this.pendingTransactions= [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction (transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Tx must include from and to address');
        }
        if(!transaction.isValid()){
            throw new Error('Only valid Transaction can be added to the block');
        }
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

            if(!currentBlock.hasValidTransactions()) return false;
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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;