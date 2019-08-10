#!/usr/bin/env node
const yParser = require('yargs-parser')
const semver = require('semver')
const { existsSync } = require('fs-extra')
const { join } = require('path')
const chalk = require('chalk')
const run = require('./lib/run')
const {
  version,
  engines: { node },
} = require('./package.json')

// print version and @local
const args = yParser(process.argv.slice(2))

if (args.v || args.version) {
  console.log(version)

  if (existsSync(join(__dirname, '.local'))) {
    console.log(chalk.cyan('@local'))
  }

  process.exit(0)
}

if (!semver.satisfies(process.version, node)) {
  console.log(chalk.red(`❌ The generator will only work with Node version ${node} !`))
  process.exit(1)
}

const name = args._[0] || ''

run({ name, args })
