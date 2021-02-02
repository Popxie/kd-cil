/*
 * @Description: prompt:提示
 * @Author: xiehuaqiang
 * @FilePath: /kada-cli/conf/index.js
 */
module.exports = {
  getDefaultPrompt: context => {
    return [
      {
        name: 'projectName',
        message: '项目的名称',
        default: context.name
      },
      {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      },
      {
        name: 'projectDescription',
        message: '项目的简介',
        default: `A project named ${context.name}`
      }
    ]
  },
  updateNPMPrompt: [
    {
      type: 'list',
      message: '请选择更新脚手架的方式',
      name: 'npmType',
      choices: [
        {
          name: 'npm',
          message: 'npm'
        },
        {
          name: 'cnpm',
          message: 'cnpm'
        },
        {
          name: 'yarn',
          message: 'yarn'
        }
      ]
    }
  ]
}
