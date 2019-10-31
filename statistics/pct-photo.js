const description = 'percentage of tweets with a photo url'

module.exports = data => new Promise(function(resolve, reject) {
  resolve({ description, value: true })
  // reject(false)
})
