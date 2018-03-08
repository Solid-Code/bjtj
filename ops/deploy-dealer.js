var dealerData = {
  abi: [ { "constant": true, "inputs": [], "name": "ethLimit", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "pitboss", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Deposit", "type": "event" }, { "constant": false, "inputs": [], "name": "overflow", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "winner", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "cashout", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ],
  bytecode: "0x6060604052341561000f57600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506104328061005e6000396000f30060606040526004361061006c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680624264c3146100bc57806341c0e1b5146100d157806351e8b5c6146100e6578063a026348c1461010f578063b7b172b314610164575b3373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2005b34156100c757600080fd5b6100cf6101a6565b005b34156100dc57600080fd5b6100e46102aa565b005b34156100f157600080fd5b6100f961033b565b6040518082815260200191505060405180910390f35b341561011a57600080fd5b610122610347565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016f57600080fd5b6101a4600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061036c565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480156102205750670de0b6b3a76400003073ffffffffffffffffffffffffffffffffffffffff1631115b156102a8576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc670de0b6b3a76400003073ffffffffffffffffffffffffffffffffffffffff1631039081150290604051600060405180830381858888f1935050505015156102a757600080fd5b5b565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610339576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b670de0b6b3a764000081565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610402578173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561040157600080fd5b5b50505600a165627a7a7230582043002409de34ea050dee8c8fff3024a74658925e2b9ab33c7255f8ed2159aa020029"
}

var dealer = web3.eth.contract(dealerData.abi)

var tx = {}
tx.data = dealerData.bytecode
tx.gas = 1000000

