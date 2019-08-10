const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const inquirer = require('inquirer')
const clipboardy = require('clipboardy')

const sequences = ['gulp', 'webpack', 'rollup', 'parcel']

const generators = fs
  .readdirSync(`${__dirname}/generators`)
  .filter(f => !f.startsWith('.'))
  .sort((prev, next) => (sequences.indexOf(prev) > sequences.indexOf(next) ? 1 : -1))
  .map(f => ({
    name: `${f.padEnd(15)} - ${chalk.gray(require(`./generators/${f}/meta.json`).description)}`,
    value: f,
    short: f,
  }))

const runGenerator = async (generatorPath, { name = '', cwd = process.cwd(), args = {} }) => {
  return new Promise(resolve => {
    if (name) {
      mkdirp.sync(name)
      cwd = path.join(cwd, name)
    }

    const Generator = require(generatorPath)
    const generator = new Generator({
      name,
      env: {
        cwd,
      },
      resolved: require.resolve(generatorPath),
      args,
    })

    return generator.run(() => {
      if (name) {
        if (process.platform !== `linux` || process.env.DISPLAY) {
          clipboardy.writeSync(`cd ${name}`)
          console.log(`📋 Copied to clipboard, just use ${chalk.blue(`Ctrl + V`)}`)
        }
      }

      console.log(`✨ ${chalk.green(`Files Generate Done`)}`)
      resolve(true)
    })
  })
}

const run = async config => {
  const answers = await inquirer.prompt([
    {
      name: 'type',
      message: 'Select the boilerplate type',
      type: 'list',
      choices: generators,
    },
  ])

  try {
    return runGenerator(`./generators/${answers.type}`, config)
  } catch (err) {
    console.error(chalk.red('> Generate failed'), err)
    process.exit(1)
  }
}

module.exports = run
