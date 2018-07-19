require('dotenv').config()

const addressFrom = process.env.ACCOUNT_ADDRESS
const httpPort = process.env.HTTP_PORT
const send = require('./lib/send')
const ethLimit = process.env.ETH_LIMIT
const web3 = require('web3')

const express = require('express')
const app = express()

app.get('/', (req, res) => res.status(404).send())
app.get('/send', (req, res) => {
  if (typeof req.query.address === 'undefined') {
    return res.status(400).send({
      success: false,
      error: 'Address is required',
    })
  }

  if (!web3.utils.isAddress(req.query.address)) {
    return res.status(400).send({
      success: false,
      error: 'Invalid address',
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
  
  if (parseFloat(req.query.value) > ethLimit) {
    return res.status(400).send({
      success: false,
      error: 'Value exceeds limit',
    })
  }

  let address = req.query.address,
    wei = web3.utils.toWei(req.query.value, 'ether')
  
  send({
    from: addressFrom,
    to: address,
    value: wei,
  }).then((tx) => {
    res.send({
      success: true,
      tx: tx,
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
