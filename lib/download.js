const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')
const logSymbols = require('log-symbols')
const chalk = require('chalk')

module.exports = function (target) {
  return new Promise((resolve, reject) => {
    const http = 'http://10.0.10.51:81/caijiale/kdadmin-fe.git'
    const ssh = 'git@10.0.10.51:caijiale/kdadmin-fe.git'
    const cwd = `${process.cwd()}/test4`
    download(`direct:${ssh}`, cwd, { clone: true }, err => {
      if (err) {
        console.log(chalk.red(`模板下载失::: ${err}`))
        reject(err)
      } else {
        console.log(logSymbols.success, chalk.green('模板下载完毕'))
        resolve(target)
      }
    })
  })
}
