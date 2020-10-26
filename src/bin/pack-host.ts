#!/usr/bin/env node

import program from 'commander';
import * as host from '../lib/host';

program.name('pack host').command('clear').description('清空pack自动创建的host映射规则').action(host.clear);
program.name('pack host').command('add').description('添加host映射规则').action(host.add);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
