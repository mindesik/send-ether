require('dotenv').config()

const jsonRpc = process.env.JSON_RPC
const account = process.env.ACCOUNT_ADDRESS
const httpPort = process.env.HTTP_PORT
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(jsonRpc))

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

  web3.eth.sendTransaction({
    from: account,
    to: address,
    value: wei,
  }).then((data) => {
    console.log(data)
    res.send({success: true})
  }).catch((err) => {
    console.error(err)
    res.status(500).send({
      success: false,
      error: 'Server error',
    })
  })

  res.send([address, wei])
})

app.listen(httpPort, () => console.log(`http://127.0.0.1:${httpPort}`))
