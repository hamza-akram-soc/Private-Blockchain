const sha256 = require('crypto-js/sha256');
class Block {
    constructor(index, timestamp, data, previousHash=""){
        this.index= index;
        this.timestamp = timestamp;
        this.data= data;
        this.previousHash= previousHash;
        this.hash= this.calculateHash();
        this.nonce =0;
    }
    calculateHash(){
        return sha256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)+ this.nonce).toString()
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
        this.difficulty =5;
    }

    createGenisiBlock(){
        return new Block("0", "03/03/2023", "Genisis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash;
        //newBlock.hash= newBlock.calculateHash();
        newBlock.minedBlock(this.difficulty)
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
console.log("mining our block 1....");
myCoin.addBlock(new Block("1", "03/03/2023", {amount: 2}));

console.log("mining our block 1....");
myCoin.addBlock(new Block("2", "04/03/2023", {amount: 20}));


//console.log(JSON.stringify(myCoin, null, 4));
