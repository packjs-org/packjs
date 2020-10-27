---
title: 命令行
order: 3
nav:
  title: 指南
  order: 1
---

# 命令

所有命令都可以通过 -h 或 --help 命令查看使用说明，如

```
➜  [/Users/pack] pack -h

      ___         ___           ___           ___
     /  /\       /  /\         /  /\         /__/|
    /  /::\     /  /::\       /  /:/        |  |:|
   /  /:/\:\   /  /:/\:\     /  /:/         |  |:|
  /  /:/~/:/  /  /:/~/::\   /  /:/  ___   __|  |:|
 /__/:/ /:/  /__/:/ /:/\:\ /__/:/  /  /\ /__/\_|:|____
 \  \:\/:/   \  \:\/:/__\/ \  \:\ /  /:/ \  \:\/:::::/
  \  \::/     \  \::/       \  \:\  /:/   \  \::/~~~~
   \  \:\      \  \:\        \  \:\/:/     \  \:\
    \  \:\      \  \:\        \  \::/       \  \:\
     \__\/       \__\/         \__\/         \__\/

   release v0.0.64

   packjs is a intelligently and lightweight packaging tool, powered by webpack.js

==============================================================

Usage: pack [options] [command]

轻量webpack抽象工具，提供常用配置且动态依赖

Options:
  -v, --version       output the version number
  -h, --help          display help for command

Commands:
  init [projectName]  脚手架
  dev [options]       运行
  build [options]     构建
  host                host规则处理
  help [command]      display help for command
```

## dev

使用：`pack dev [option]`

本地构建运行

## build

使用：`pack build [option]`

编译产物

## init

使用：`pack init [projectName]`

脚手架

## host

host 规则处理命令

### clear

使用：`pack host clear`

清空由 packjs 自动生成的 host 映射规则

### add

使用：`pack host add [rules]`

添加 host 映射规则
