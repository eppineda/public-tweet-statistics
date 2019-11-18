'use strict'

export {}
const { parentPort } = require('worker_threads')

parentPort.on('message', data => {
  const description = 'average tweets per minute'
  let calculation

  // todo - parse and calculate
  parentPort.postMessage(`${ description }: ${ calculation }`)
})
