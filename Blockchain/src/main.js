const{Blockchain, Transaction}= require('./blockchain.js')
const EC = require('elliptic').ec;

const ec= new EC('secp256k1');

const myKey = ec.keyFromPrivate('204c57a63ae83155a3adaada5f6dbb81e3c0e698d368531e5960d8ebb5e2b42e')

const myWallet = myKey.getPublic('hex');

let myCoin = new Blockchain();

const tx1 = new Transaction(myWallet, 'ToAddress', 10);
tx1.signTransactions(myKey);
myCoin.addTransaction(tx1);

console.log("\nMining the Block...");
myCoin.minePendingTransactions(myWallet);

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress(myWallet));
