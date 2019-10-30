const commander = require('commander')
const program = new commander.Command()

program.version('0.0.1')
program
  .option('-d, --debug', 'output extra debugging')

program.parse(process.argv)

if (!program.debug)
  console.log = () => {}
else
  console.log(program.opts())

const onSuccess = result => {
  console.log(`${ result.description }: ${ result.value }`)
}
const onFailure = error => {
  console.error(error)
}
const start = async () => {
  const statistics = {
    total: require('./statistics/total'),
  }
  const total = await statistics.total()
    .then(onSuccess)
    .catch(onFailure)
}

start()
