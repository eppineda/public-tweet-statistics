'use strict'

export {}
const { parentPort } = require('worker_threads')

parentPort.on('message', data => {
  const description = 'total number of tweets received'
  let calculation = data.tweets.length

  parentPort.postMessage(`${ description }: ${ calculation }`)
})
