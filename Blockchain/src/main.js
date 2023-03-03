const{Blockchain, Transaction}= require('./blockchain.js')

let myCoin = new Blockchain();

myCoin.createTransaction(new Transaction("address1", "address2", 20))
myCoin.createTransaction(new Transaction("address2", "address1", 10))

console.log("\nMining the Block...");
myCoin.minePendingTransactions("hamza-address");

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress("hamza-address"));

console.log("\nMining the Block Again...");
myCoin.minePendingTransactions("hamza-address");

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress("hamza-address"));