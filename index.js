const commander = require('commander')
const program = new commander.Command()

program.version('0.0.1')
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --shutdown', 'shutdown')
program.parse(process.argv)

if (!program.debug)
  console.log = () => {}
else
  console.log(program.opts())

console.log('hi')
