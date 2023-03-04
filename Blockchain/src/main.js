const{Blockchain, Transaction}= require('./blockchain.js')
const EC = require('elliptic').ec;

const ec= new EC('secp256k1');

const myKey = ec.keyFromPrivate('5c00e1f734f7ee2511eb998bf614455b462965315819a35c1bd037c316378739');

const myWallet = myKey.getPublic('hex');

let myCoin = new Blockchain();

const tx1 = new Transaction(myWallet, 'ToAddress', 10);
tx1.signTransactions(myKey);
myCoin.addTransaction(tx1);

console.log("\nMining the Block...");
myCoin.minePendingTransactions(myWallet);

console.log("\n Mine Balance is: " + myCoin.getBalanceOfAddress(myWallet));
