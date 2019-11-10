#! /usr/bin/env node

const commander = require('commander')
const program = new commander.Command()

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
  const { BehaviorSubject } = require('rxjs')
  const tweets$ = new BehaviorSubject()
  const statistics = []
  const onError = e => console.error(`doh! ${ e }`)
  const onComplete = () => { process.exit() }

  stream.on('tweet', function (update) {
    tweets$.next(update)
  })
  tweets$.subscribe(console.log, onError, onComplete)
  setTimeout(() => {
    tweets$.complete()
  }, 1000)

  /*
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
    let s = tweets$.subscribe(calculate, onError, onComplete)
  }
  */
})()
