const description = 'percentage of tweets with emojis'

module.exports = data => new Promise(function(resolve, reject) {
  resolve({ description, value: true })
  // reject(false)
})
