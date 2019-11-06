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
  const rxjs = require('rxjs')
  const subject = new rxjs.BehaviorSubject()
  const statistics = []
  const tweets = await require('./tweets')
  const stream = tweets.stream('statuses/sample')

  stream.on('tweet', function (tweet) {
    subject.next(tweet)
  })
  subject.subscribe(console.log)
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