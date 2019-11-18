#! /usr/bin/env node

'use strict'

const commander = require('commander')
const program = new commander.Command()
const OUTPUT = console.log

// process command line

program.version('0.0.1')
program.option('-d, --debug', 'output extra debugging')
program.option('-t, --time <millseconds>', 'specify in milliseconds for how long to listen for new tweets (defaults to 2500)')
program.option('--top-hashtags <count>', 'specify the top <count> hashtags (defaults to 3)')
program.option('--top-emojis <count>', 'specify the top <count> emojis (defaults to 3)')
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
  const TIME_LIMIT = program.time || 2500; console.log(`listening for ${ TIME_LIMIT } millseconds`)
  const COUNT_TOP_HASHTAGS = program.topHashtags || 3; console.log(`calculating top ${ COUNT_TOP_HASHTAGS } hashtags`)
  const COUNT_TOP_EMOJIS = program.topEmojis || 3; console.log(`calculating top ${ COUNT_TOP_EMOJIS } emojis`)
  const instructions = {
    topHashtags: COUNT_TOP_HASHTAGS,
    topEmojis: COUNT_TOP_EMOJIS,
  }
  const {
    isMainThread, MessageChannel, Worker,
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
  const workers = {}
  const tweets = []
  const beautify = require('json-beautify')

  if (!isMainThread) process.exit() // nothing to do

  for (const s of scripts) {
    const w = new Worker(s); console.log(`Worker ${ w.threadId } - ${ s }`)

    workers[s] = w
    w.on('message', calculation => {
      OUTPUT(calculation)
    })
  }

  stream.on('tweet', function (update) {
    tweets$.next(update) // todo - observable still needed?
    tweets.push(update); console.log(beautify(tweets, null, 2, 80))
    for (const w in workers) {
      workers[w].postMessage({ instructions, tweets })
    }
  })
  tweets$.subscribe(() => {}, onError, onComplete)
  setTimeout(() => {
    tweets$.complete()
  }, TIME_LIMIT)

})()
