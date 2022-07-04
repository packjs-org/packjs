---
title: FAQ
order: 4
nav:
  title: 指南
  order: 1
---

### 1. window npm run dev 执行错误

原因是 window 命令机制和 linux 不同：
https://stackoverflow.com/questions/23243353/how-to-set-shell-for-npm-run-scripts-in-windows

解决方案：设置为 git bash 路径，再去执行`npm run dev`就不会找不到命令了

```shell script
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

若要恢复也可以执行如下命令

```shell script
npm config delete script-shell
```
