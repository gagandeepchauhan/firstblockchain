var SHA256 = require("crypto-js/sha256");
// console.log(SHA256("krishna").toString())
//or
// var CryptoJS = require("crypto-js");
// console.log(CryptoJS.SHA256('shiva').toString());

class Block{
	constructor(index,timestamp,data,prevHash=''){
		this.index=index
		this.timestamp=timestamp
		this.data=data
		this.prevHash=prevHash
		this.hash=this.calculateHash()
		this.nonce=1
	}
	calculateHash(){
		return SHA256(this.index+this.prevHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString()
	}
}
class Blockchain{
	constructor(){
		this.chain=[this.createGenesisBlock()]
		this.difficulty=8
	}
	createGenesisBlock(){
		return (new Block(0,Date.now(),"Genesis Block",'0'))
	}
	getLatestBlock(){
		return this.chain[this.chain.length-1]
	}
	mineBlock(newBlock){//embedding 'proof of work mechanism' in adding a block called mining
		newBlock.prevHash=this.getLatestBlock().hash
		while(newBlock.hash.substring(0,this.difficulty)!==Array(this.difficulty+1).join('0')){
			newBlock.nonce++
			newBlock.hash=newBlock.calculateHash()
		}
		this.chain.push(newBlock)
	}
	isChainValid(){
		for(let i=1;i<this.chain.length;i++){
			let prevBlock=this.chain[i-1]
			let currBlock=this.chain[i]
			if(currBlock.hash!==currBlock.calculateHash()){
				return false
			}
			if(currBlock.prevHash!==prevBlock.hash){
				return false
			}
		}
		return true
	}
}

const skychain=new Blockchain()
console.log("Mining block 1...")
skychain.mineBlock(new Block(1,Date.now(),{amt:50}))
console.log('After mined hash : '+skychain.chain[1].hash)
console.log("Mining block 2...")
skychain.mineBlock(new Block(2,Date.now(),{amt:500}))
console.log('After mined hash : '+skychain.chain[2].hash)

// console.log(JSON.stringify(skychain,null,4))
console.log(`Is chain valid? ${skychain.isChainValid()}`)
// skychain.chain[1].data={amt:7000}
// console.log(`Is chain valid now? ${skychain.isChainValid()}`)
// for(i=1;i<skychain.chain.length;i++){
// 	skychain.chain[i].prevHash=skychain.chain[i-1].hash
// 	skychain.chain[i].hash=skychain.chain[i].calculateHash()
// }
// console.log(`Is chain valid after putting mal effort? ${skychain.isChainValid()}`)