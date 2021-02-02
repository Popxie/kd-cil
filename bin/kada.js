#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
// console.log(chalk.red('\n × Template does not exit!'))

console.log()
console.log('kada-cli-version', require('../package').version, '\n')

// 执行 kada 命令提示语
program
  .version(require('../package').version)
	.usage('<command> [项目名称]')
	.command('create', '创建新项目')
	.parse(process.argv)