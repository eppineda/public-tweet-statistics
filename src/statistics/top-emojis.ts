'use strict'

export {}
const { parentPort } = require('worker_threads')
const beautify = require('json-beautify')
const searchEmoji = searched => {
  let found = []
  const regex = require('emoji-regex/text.js')()
  let match

  searched.forEach(s => {
    if (match = regex.exec(s)) {
      const emoji = match

      console.log(`emoji: ${ match }`)
      found.push(emoji)
    }
  })
  return found
}
const tally = {}
const updateTally = emojis => {
  const s = new Set(Object.keys(tally))

  emojis.forEach(e => {
// maintain a running tally of each emoji found
    if (s.has(e)) {
      console.log(`tally: incrementing ${ e } ${ tally[e] }`)
      ++tally[e]
    }
    else {
      console.log(`tally: tracking first instance of ${ e }`)
      tally[e] = 1
    }
    console.log(`tally: ${ beautify(tally, null, 2, 80) }`)
  })
}
const searchHashtags = data => {
  data.tweets.forEach(t => { console.log(`tweet: ${ t.text }`)
// examine each tweets for any hashtags used
    const tags = []

    console.log(`tally: tags tracked ${ beautify(tally, null, 2, 80) }`)
    t.entities.hashtags.forEach(t => {
// make a list
      tags.push(t.text)
    }); console.log(`tally: tags for tweet #${ t.id } ${ beautify(tags) }`)

    const emojis = []

    emojis.push(...searchEmoji(tags))
    updateTally(emojis)
  })
} // searchHashtags
const searchTweets = data => {
  const tweets = []
  const emojis = []

  data.tweets.forEach(t => { console.log(`tweet: ${ t.text }`)
    tweets.push(t.text)
  })
  emojis.push(...searchEmoji(tweets))
  updateTally(emojis)
} // searchTweets

parentPort.on('message', data => {
  const description = 'top emojis'
  const max = data.instructions.topEmojis
  const format = entry => {
    formatted += `${ entry[0] }-${ entry[1] } `
  }
  let calculation
  let formatted = ''

  searchHashtags(data)
  searchTweets(data)

// report only the top <max> emojis
  calculation = Object.entries(tally).sort((a: any, b: any) => b[1] - a[1]).slice(0, max)
  calculation.forEach(format)
  parentPort.postMessage(`${ description }: ${ formatted }`)
})
