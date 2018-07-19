require('dotenv').config()

const infuraKey = process.env.INFURA_KEY
const privKey = process.env.PRIVATE_KEY
const addressFrom = process.env.ACCOUNT_ADDRESS
const httpPort = process.env.HTTP_PORT
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/' + infuraKey))
const Tx = require('ethereumjs-tx')

const account = web3.eth.accounts.privateKeyToAccount(privKey.indexOf('0x') === 0 ? privKey : '0x' + privKey)

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  if (typeof req.query.address === 'undefined') {
    return res.status(400).send({
      success: false,
      error: 'Address is required',
    })
  }

  if (typeof req.query.value === 'undefined') {
    return res.status(400).send({
      success: false,
      error: 'Value is required',
    })
  }

  if (isNaN(req.query.value)) {
    return res.status(400).send({
      success: false,
      error: 'Value is NaN',
    })
  }

  let address = req.query.address,
    wei = parseFloat(req.query.value) * 10e18
  
  const parameters = {
    from: addressFrom,
    to: address,
    value: wei,
  }

  web3.eth.estimateGas(parameters).then((gasLimit) => {
    parameters.gasLimit = web3.utils.toHex(gasLimit + 10000)
    return web3.eth.getGasPrice()
  }).then((gasPrice) => {
    parameters.gasPrice = web3.utils.toHex(gasPrice)
    return web3.eth.getTransactionCount(account.address)
  }).then((count) => {
    parameters.nonce = count
    const transaction = new Tx(parameters)
    transaction.sign(Buffer.from(account.privateKey.replace('0x', ''), 'hex'))
    web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex')).once('transactionHash', (hash) => {
      res.send({
        success: true,
        tx: 'https://kovan.etherscan.io/tx/' + hash,
      })
      console.info('transactionHash', 'https://etherscan.io/tx/' + hash)
    }).once('receipt', (receipt) => {
      console.info('receipt', receipt)
    }).on('confirmation', (confirmationNumber, receipt) => {
      console.info('confirmation', confirmationNumber, receipt)
    }).on('error', (err) => {
      res.status(500).send({
        success: false,
        error: 'Server error',
      })
      console.error(err)
    })
  }).catch((err) => {
    res.status(500).send({
      success: false,
      error: 'Server error',
    })
    console.error(err)
  })
})

app.listen(httpPort, () => console.log(`http://127.0.0.1:${httpPort}`))
