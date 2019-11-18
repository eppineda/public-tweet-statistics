'use strict'

export {}
const { parentPort } = require('worker_threads')

parentPort.on('message', data => {
  const description = 'percentage of tweets with a url'
  let calculation

  // todo - parse and calculate
  parentPort.postMessage(`${ description }: ${ calculation }`)
})
