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
  const connection = await require('./tweets')
  const stream = connection.stream('statuses/sample')
  const rxjs = require('rxjs')
  const tweets = new rxjs.BehaviorSubject()
  const statistics = []

  stream.on('tweet', function (update) {
    tweets.next(update)
  })
  /*
  statistics.push(require('./statistics/total'))
  statistics.push(require('./statistics/per-hour'))
  statistics.push(require('./statistics/per-minute'))
  statistics.push(require('./statistics/per-second'))
  statistics.push(require('./statistics/top-emojis'))
  */
  statistics.push(require('./statistics/pct-emojis'))
  /*
  statistics.push(require('./statistics/top-hashtags'))
  statistics.push(require('./statistics/pct-url'))
  statistics.push(require('./statistics/pct-photo'))
  statistics.push(require('./statistics/top-domains'))
  */

/*
  for (let calculate of statistics) {
    tweets.subscribe(calculate)
  }
*/
  let s
  
  try {
    s = tweets.subscribe(statistics[0])
  } catch (e) {
    console.error(e)
    s.unsubscribe()
  }
})()
