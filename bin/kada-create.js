#!/usr/bin/env node
// NODE moudle
//  node.js 命令行解决方案
const program = require('commander')

// node.js path模块
const path = require('path')

// node.js fs模块
const fs = require('fs')

// 常见的交互式命令行用户接口的集合
const inquirer = require('inquirer')

// 使用shell模式匹配文件
const glob = require('glob')

// 获取最新的npm包版本号
const latestVersion = require('latest-version')

// node.js 子进程
const spawn = require('child_process').spawn

// node.js 命令行环境的 loading效果， 和显示各种状态的图标
const ora = require('ora')

// The UNIX command rm -rf for node.
const rm = require('rimraf').sync

// file
const dowload = require('../lib/download')
const log = require('../utils/log')
const generator = require('../lib/generator')
const CONST = require('../conf/const')
const templateConfig = require('../conf/template.json')
const configDefalut = require('../conf/index')

program.usage('<project-name>').parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  return program.help()
}

// 返回 Node.js 进程的当前工作目录
const cwd = process.cwd()
// 获取当前项目name
let rootName = path.basename(cwd)

/**
 * 重置数据
 */
function resetParam(proName) {
  if (proName) {
    rm(proName)
    rm(CONST.TEMPLATE_NAME)
  }
}

/**
 * 检测脚手架的版本
 */
function checkVersion() {
  return new Promise(async (resolve, reject) => {
    let onlineVersion = await latestVersion(`${CONST.CLI_NAME}`)
    let localVersion = require('../package.json').version
    console.log(`本地版本${localVersion}, 最新版本${onlineVersion}`)
    let onlineVersionArr = onlineVersion.split('.')
    let localVersionArr = localVersion.split('.')
    let isNew = onlineVersionArr.some((item, index) => {
      return Number(item) > Number(localVersionArr[index])
    })
    resolve(isNew)
  })
}

/**
 * 升级脚手架
 * inquirer.prompt 提示选项插件
 */
function updateCli() {
  return new Promise(async resolve => {
    const promptArr = configDefalut.updateNPMPrompt
    let { npmType } = await inquirer.prompt(promptArr)
    const spinner = ora(`开始更新${CONST.CLI_NAME}···`)
    let ps
    // 这里要注意 不同平台执行名不同
    const isWin32 = process.platform === 'win32'

    switch (npmType) {
      case 'npm':
        spinner.start()
        const npmCommand = isWin32 ? 'npm.cmd' : 'npm'
        ps = spawn(npmCommand, ['install', 'alice-cli', '-g'])
        break
      case 'cnpm':
        spinner.start()
        const cnpmCommand = isWin32 ? 'cnpm.cmd' : 'cnpm'
        ps = spawn(cnpmCommand, ['install', 'alice-cli', '-g'])
        break
      case 'yarn':
        spinner.start()
        ps = spawn('yarn', ['global', 'add', 'alice-cli'])
        break
    }

    // 执行结果的回调  只有npm看不到
    ps.stdout.on('data', data => {
      spinner.text = data.toString()
    })
    ps.on('close', () => {
      spinner.succeed()
      log.succes('更新成功')
      resolve()
    })
  })
}

/**
 * 检测路径
 * 判断有没有重名
 */
function checkDir() {
  return new Promise(async (resolve, reject) => {
    // 返回根目录下的一级目录名&文件名
    const list = glob.sync('*')
    if (list.length) {
      const nameList = list.filter(name => {
        const relativePath = path.join('./', name)
        const absolutePath = path.resolve(cwd, relativePath)
        // 是否是目录文件
        const isDir = fs.statSync(absolutePath).isDirectory()
        return name.indexOf(projectName) !== -1 && isDir
      })
      if (nameList.length !== 0) {
        const msg = `项目<<${projectName}>>已经存在`
        reject({ msg })
      }
      resolve(projectName)
    } else if (rootName === projectName) {
      let { buildInCurrent } = await inquirer.prompt([
        {
          name: 'buildInCurrent',
          message:
            '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目',
          type: 'confirm',
          default: true
        }
      ])
      resolve(buildInCurrent ? '.' : projectName)
    } else {
      resolve(projectName)
    }
  })
}

/**
 * 创建项目文件夹
 * @param {String} proName  projectName 项目名称
 */
function makeDir(proName) {
  if (proName !== '.') {
    fs.mkdirSync(projectName)
  }
}

/**
 * 模板选择
 */
function selectTemplate() {
  return new Promise(resolve => {
    let choices = Object.values(templateConfig).map(item => {
      return {
        name: item.name,
        value: item.value
      }
    })
    let config = {
      type: 'list', // checkbox
      message: '请选择需要创建的项目类型',
      name: 'select',
      choices: [new inquirer.Separator('模板类型'), ...choices]
    }
    inquirer.prompt(config).then(data => {
      let { git } = templateConfig[data.select]
      resolve({ git })
    })
  })
}

function render(projectRoot, templateName, customizePrompt) {
  console.log('templateName: ', templateName)
  return new Promise(async (resolve, reject) => {
    try {
      let context = {
        name: projectRoot, // 项目文件名
        root: projectRoot, // 项目文件路径
        downloadTemp: templateName // 模板位置
      }
      console.log('context: ', context)
      // 获取默认配置
      const promptArr = configDefalut.getDefaultPrompt(context)
      // 添加模板自定义配置
      promptArr.push(...customizePrompt)
      let answer = await inquirer.prompt(promptArr)
      let generatorParam = {
        metadata: {
          ...answer
        },
        src: context.downloadTemp,
        dest: context.root
      }
      console.log('generatorParam: ', generatorParam)
      await generator(generatorParam)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
async function init() {
  let proName, templateName
  try {
    // 检测版本
    // let isUpate = await checkVersion()

    // 更新版本
    // if (isUpate) await updateCli()
    // await updateCli()

    // 检测路径
    // proName = await checkDir()

    // 创建项目文件夹
    // makeDir(proName)

    // 选择模板
    let { git } = await selectTemplate()
    console.log('git: ', git)

    // 下载模板
    // templateName = await dowload(rootName, git)

    await render(proName, templateName, customizePrompt)
  } catch (err) {
    log.error(`创建失败：${err.msg}`)
    resetParam(proName, templateName)
  }
}

init()
