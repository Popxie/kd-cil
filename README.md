# 项目介绍

## 相关文档

[Node.js 中文网](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)

## 依赖介绍

- [ora](https://www.npmjs.com/package/ora)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [download-git-repo](https://www.npmjs.com/package/download-git-repo)
- [commander](https://www.npmjs.com/package/commander)

---

- es6：新版本的 node.js 对于 es6 的支持度已经非常高，使用 es6 能够极大地提升开发效率和开发感受。

- commander：TJ 大神开发的工具，能够更好地组织和处理命令行的输入。

- co：TJ 大神开发的异步流程控制工具，用更舒服的方式写异步代码。

- co-prompt：还是 TJ 大神的作品……传统的命令行只能单行一次性地输入所有参数和选项，使用这个工具可以自动提供提示信息，并且分步接收用户的输入，体验类似 npm init 时的一步一步输入参数的过程。

```
__dirname：    获得当前执行文件所在目录的完整目录名
__filename：   获得当前执行文件的带有完整绝对路径的文件名
process.cwd()：获得当前执行node命令时候的文件夹目录名
./：           不使用require时候与process.cwd()一样，使用require时候与__dirname一样
```