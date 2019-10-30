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
