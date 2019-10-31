const description = 'average tweets per second'

module.exports = data => new Promise(function(resolve, reject) {
  resolve({ description, value: true })
  // reject(false)
})
