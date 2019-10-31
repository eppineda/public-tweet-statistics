#! /usr/bin/env node

const commander = require('commander')
const program = new commander.Command()
const errorCodes = {
  TWITTER_API_KEY_: 1,
}

// process command line

program.version('0.0.1')
program.option('-d, --debug', 'output extra debugging')
program.parse(process.argv)

const fs = require('fs')
let key

// read the twitter api key and consumer_secret

try {
  fs.readFile('api.json', (err, data) => {
    if (err) throw err
    key = JSON.parse(data); console.log(key)
  })
} catch (e) {
  process.exit(errorCode.TWITTER_API_KEY)
}

if (!program.debug)
  console.error = console.log = () => {}
else
  console.log(program.opts())

// begin main execution

const onSuccess = result => {
  console.log(`${ result.description }: ${ result.value }`)
}
const onFailure = error => {
  console.error(error)
}

(async () => {
  const statistics = []

  statistics.push(require('./statistics/total'))
  statistics.push(require('./statistics/per-hour'))
  statistics.push(require('./statistics/per-minute'))
  statistics.push(require('./statistics/per-second'))
  statistics.push(require('./statistics/top-emojis'))
  statistics.push(require('./statistics/pct-emojis'))
  statistics.push(require('./statistics/top-hashtags'))
  statistics.push(require('./statistics/pct-url'))
  statistics.push(require('./statistics/pct-photo'))
  statistics.push(require('./statistics/top-domains'))
  
  for (let calculate of statistics) {
    await calculate()
    .then(onSuccess)
    .catch(onFailure)
  }
})()
