import fs from 'fs'
import net from 'net'
import Web3 from 'web3'
import https from 'https'

import dealerData from '../build/contracts/Dealer.json'
import db from './database'

var web3 // will provide either via ws or ipc
if (process.env.NODE_ENV === 'development') {
  web3 = new Web3('ws://ethprovider_ganache:8545')
} else {
  var web3 = new Web3(new Web3.providers.IpcProvider(
    process.env.ETH_PROVIDER,
    new net.Socket()
  ))
}

////////////////////////////////////////
// Internal global variables

var ethGasStation = 'https://ethgasstation.info/json/ethgasAPI.json'

const from = process.env.ETH_ADDRESS.toLowerCase()
const secret = fs.readFileSync(`/run/secrets/${from}`, 'utf8')

////////////////////////////////////////
// Utilities

const die = (msg) => {
  console.error(`${new Date().toISOString()} [ETH] Fatal: ${msg}`)
  process.exit(1)
}

const log = (msg) => {
  if (true) console.log(`${new Date().toISOString()} [ETH] ${msg}`)
}


////////////////////////////////////////
// Internal helper functions

const BN = web3.utils.BN

// return instance of deployed dealer contract
const getDealer = () => {
  return web3.eth.net.getId().then((id)=>{
    if (!dealerData.networks[id]) {
      die(`Dealer contract hasn't been deployed to network ${id}`)
    }
    const address = dealerData.networks[id].address
    return (new web3.eth.Contract(dealerData.abi, address))
  }).catch(die)
}

// Return gas price in wei
const getGasPrice = () => {
  return new Promise( (resolve, reject) => {
    https.get(ethGasStation, (res) => {
      res.setEncoding('utf8')
      var data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        // Div by 10 because API returns 10x high value
        return resolve(web3.utils.toWei(String(JSON.parse(data).average/10), 'gwei'))
      })
      res.on('error', (err) => {
        return reject(err)
      })
    })
  })
}

const sendTx = (tx) => {

  tx.from = process.env.ETH_ADDRESS.toLowerCase()
  return getGasPrice().then((gasPrice) => {
    tx.gasPrice = gasPrice * 1.2

    return web3.eth.estimateGas(tx).then(gas=>{
      tx.gas = gas * 2

      return web3.eth.personal.unlockAccount(tx.from, secret, 'utf8').then((res) => {

          // send the transaction
          return new Promise((resolve, reject) => {
            web3.eth.sendTransaction(tx).once('transactionHash', (txHash) => {
              return resolve(txHash)
            }).catch((error) => {
              return reject(error)
            })
          })
          
      }).catch(die)
    }).catch(die)
  }).catch(die)
}

////////////////////////////////////////
// Exported object methods

const eth = {}

// returns number of chips aka mETH dealer has
eth.getDealerBalance = () => {
  return getDealer().then((dealer) => {
    return web3.eth.getBalance(dealer.options.address).then((balance) => {
      return web3.utils.fromWei(balance, 'milli')
    }).catch(die)
  }).catch(die)
}

eth.cashout = (addr, chips) => {
  return getDealer().then((dealer) => {

    log(`Cashing out ${chips} Wei to ${addr.substring(0,10)}`)

    return sendTx({
      to: dealer.options.address,
      data: dealer.methods.cashout(addr, web3.utils.toWei(String(chips), 'milli')).encodeABI()
    })

  }).catch(die)
}

////////////////////////////////////////
// Activate event listener

getDealer().then(dealer => {
  dealer.events.Deposit((err, res) => {
    if (err) { die(err) }
    const chips = web3.utils.fromWei(res.returnValues._value, 'milli')
    const from = res.returnValues._from
    log(`Deposit detected: ${chips} mETH from ${from.substring(0,10)} `)
    db.addChips(from, Number(chips))
  })
})

////////////////////////////////////////
// Before exporting: Test Eth connection, print stats or die

web3.eth.net.getId().then((id)=>{

  const msg = `Make sure you've loaded account ${from.substring(0,10)} into this ethprovider`
  return web3.eth.getAccounts().then(accounts => {
    if (!accounts.map(a=>a.toLowerCase()).includes(from)) die(msg)

    return getDealer().then(dealer => {
      const address = dealer.options.address

      return web3.eth.getBalance(address).then((bal) => {
        const balance = web3.utils.fromWei(bal,'milli')

        log(`Connected to network ${id}; Dealer at ${address.substring(0,10)} has balance ${balance} mETH`)

      }).catch(die)
    }).catch(die)
  }).catch(die)
}).catch(die)

export default eth
