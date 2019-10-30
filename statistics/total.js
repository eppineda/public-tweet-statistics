const description = 'total number of tweets received'

module.exports = data => new Promise(function(resolve, reject) {
  resolve({ description, value: true })
  // reject(false)
})
