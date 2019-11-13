'use strict'

export {}
const { parentPort } = require('worker_threads')
const beautify = require('json-beautify')

console.log = () => {} // comment out for debugging
parentPort.on('message', data => {
  const description = 'top hashtags'
  const max = data.instructions.topHashtags
  const tally = {}
  let calculation

  data.tweets.forEach(t => {
// examine each tweets for any hashtags used
    const tags = []
    const s = new Set(Object.keys(tally))

    console.log(`tally: tags tracked ${ beautify(tally, null, 2, 80) }`)
    t.entities.hashtags.forEach(t => {
// make a list
      tags.push(t.text)
    }); console.log(`tally: tags for tweet #${ t.id } ${ beautify(tags) }`)
    tags.forEach(t => {
// maintain a running tally of each hashtag found
      if (s.has(t)) {
        console.log(`tally: incrementing ${ t } ${ tally[t] }`)
        ++tally[t]
      }
      else {
        console.log(`tally: tracking first instance of ${ t }`)
        tally[t] = 1
      }
      console.log(`tally: ${ beautify(tally, null, 2, 80) }`)
    })
  })
// report only the top <max> hashtags
  calculation = Object.entries(tally).sort((a: any, b: any) => b[1] - a[1]).slice(0, max)
  parentPort.postMessage(`${ description }: ${ calculation }`)
})
