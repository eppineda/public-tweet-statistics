const description = 'percentage of tweets with a url'

module.exports = data => new Promise(function(resolve, reject) {
  resolve({ description, value: true })
  // reject(false)
})
