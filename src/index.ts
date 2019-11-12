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
  const TIME_LIMIT = 250

  stream.on('tweet', function (update) {
    tweets$.next(update)
  })
  tweets$.subscribe(console.log, onError, onComplete)
  setTimeout(() => {
    tweets$.complete()
  }, TIME_LIMIT)

  const {
    Worker, isMainThread, parentPort, workerData
  } = require('worker_threads');
  const scripts = [
    './statistics/total.js',
    './statistics/per-hour.js',
    './statistics/per-minute.js',
    './statistics/per-second.js',
    './statistics/top-emojis.js',
    './statistics/pct-emojis.js',
    './statistics/top-hashtags.js',
    './statistics/pct-url.js',
    './statistics/pct-photo.js',
    './statistics/top-domains.js',
  ]

  if (!isMainThread) process.exit() // nothing to do

  for (const s of scripts) {
    const w = new Worker(s)

    console.log(`Worker ${ w.threadId } - ${ s }`)
  }
  /*
  for (let calculate of statistics) {
    let s = tweets$.subscribe(calculate, onError, onComplete)
  }
  */
})()
