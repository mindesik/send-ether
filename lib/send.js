const infuraKey = process.env.INFURA_KEY
const privKey = process.env.PRIVATE_KEY

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/' + infuraKey))
const Tx = require('ethereumjs-tx')

const account = web3.eth.accounts.privateKeyToAccount(privKey.indexOf('0x') === 0 ? privKey : '0x' + privKey)

module.exports = (parameters) => {
  return new Promise((resolve, reject) => {
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
        resolve('https://kovan.etherscan.io/tx/' + hash)
        console.info('transactionHash', 'https://etherscan.io/tx/' + hash)
      }).once('receipt', (receipt) => {
        console.info('receipt', receipt)
      }).on('confirmation', (confirmationNumber, receipt) => {
        console.info('confirmation', confirmationNumber, receipt)
      }).on('error', (err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}