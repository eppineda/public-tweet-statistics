'use strict'

export {}
const { parentPort } = require('worker_threads')

parentPort.on('message', data => {
  const description = 'total number of tweets received'
  let calculation

  // todo - parse and calculate
  parentPort.postMessage(`${ description }: ${ calculation }`)
})
