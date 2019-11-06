const { promisify } = require('util')
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)
let credentials = {
  consumer: null,
  access: null,
}
const onReadConsumerCredentials = (err, data) => {
  if (err) throw err

  credentials.consumer = JSON.parse(data)
} // onRead
const onReadAccessCredentials = (err, data) => {
  if (err) throw err

  credentials.access = JSON.parse(data)
} // onRead

module.exports = new Promise(function(resolve, reject) {
  const onRead = async result => {
    credentials.consumer = JSON.parse(result[0])
    credentials.access = JSON.parse(result[1])

    const Twit = require('twit')
    const T = new Twit({
      consumer_key:         credentials.consumer.key,
      consumer_secret:      credentials.consumer.secret,
      access_token:         credentials.access.key,
      access_token_secret:  credentials.access.secret,
      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
      strictSSL:            true,     // optional - requires SSL certificates to be valid.
    })

    resolve(T)
  } // onRead

  Promise.all([ readFileAsync('./api.json'), readFileAsync('./access.json') ])
  .then(onRead)
  .catch(e => {
    reject(e)
  })
})
