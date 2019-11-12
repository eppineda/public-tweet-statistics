const description = 'total number of tweets received'
const { parentPort } = require('worker_threads')

parentPort.postMessage(`calculated: ${ description }`)
parentPort.on('message', msg => {
  console.log(`received: ${ msg }`)
})
