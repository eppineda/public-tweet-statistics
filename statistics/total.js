const description = 'Total number of tweets received'

module.exports = {
  description,
  calculate: data => new Promise(function(resolve, reject) {
    resolve({ description, value: true })
    // reject(false)
  })
}
