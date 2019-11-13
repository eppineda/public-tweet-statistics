'use strict'

export {}
const { parentPort } = require('worker_threads')

parentPort.on('message', data => {
  const description = 'top domains of urls in tweets'
  let calculation

  // todo - parse and calculate
  parentPort.postMessage(`${ description }: ${ calculation }`)
})
