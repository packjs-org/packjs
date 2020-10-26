#!/usr/bin/env node

import program from 'commander';
import { Core } from '../lib/core';
import init from '../lib/init';
const pkg = require('../../package.json');
const core = new Core();

program.version(pkg.version, '-v, --version').name('pack').description(`轻量webpack抽象工具，提供常用配置且动态依赖`);

program.command('init [projectName]').description('脚手架').action(init);
program.command('dev').description('运行').option('-p, --print', '打印当前webpack配置').action(core.dev);
program.command('build').description('构建').option('-p, --print', '打印当前webpack配置').action(core.build);
program.command('host', 'host规则处理');

program.parse(process.argv);

// if (!program.args.length) {
//     program.help();
// }
