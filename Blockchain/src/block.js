const sha256 = require('crypto-js/sha256');
class Block {
    constructor(index, timestamp, data, previousHash=""){
        this.index= index;
        this.timestamp = timestamp;
        this.data= data;
        this.previousHash= previousHash;
        this.hash= this.calculateHash();
    }
    calculateHash(){
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString()
    }
}
class Blockchain{

    constructor(){
        this.chain = [this.createGenisiBlock()];
    }

    createGenisiBlock(){
        return new Block("0", "03/03/2023", "Genisis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash;
        newBlock.hash= newBlock.calculateHash();
        this.chain.push(newBlock);
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
myCoin.addBlock(new Block("1", "03/03/2023", {amount: 2}));
myCoin.addBlock(new Block("2", "04/03/2023", {amount: 20}));

//console.log(JSON.stringify(myCoin, null, 4));

//Use case where change is being done in the block
console.log("is our chain valid: " + myCoin.isChainValid());
myCoin.chain[1].data = {amount: 200};
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

console.log("is our chain valid: " + myCoin.isChainValid());

//console.log(JSON.stringify(myCoin, null, 4));
