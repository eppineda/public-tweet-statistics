#! /usr/bin/env node

'use strict'

const commander = require('commander')
const program = new commander.Command()
const OUTPUT = console.log

// process command line

program.version('0.0.1')
program.option('-d, --debug', 'output extra debugging')
program.option('-t, --time <millseconds>', 'specify in milliseconds for how long to listen for new tweets (defaults to 2500)')
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
  const { MessageChannel } = require('worker_threads');

  stream.on('tweet', function (update) {
    tweets$.next(update)
  })
  tweets$.subscribe(() => {}, onError, onComplete)
  setTimeout(() => {
    tweets$.complete()
  }, TIME_LIMIT)

  const {
    Worker, isMainThread,
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
    const w = new Worker(s); console.log(`Worker ${ w.threadId } - ${ s }`)

    w.on('message', msg => {
      console.log(`Thread ${ w.threadId } received: ${ msg }`)
    })
    w.postMessage('hi')
  }
})()
