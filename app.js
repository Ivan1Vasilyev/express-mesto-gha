const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const PORT = '27017/mestodb-Vasilyev'

const app = express()

app.listen(PORT, () => {
  console.log(`connected to port: ${PORT}`)
})
