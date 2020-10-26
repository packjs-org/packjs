import * as inquirer from 'inquirer';
import fs from 'fs-extra';
import logger from '../util/logger';
import * as storage from '../util/storage';
import prettyOutput from 'prettyoutput';
import * as path from 'path';
import { CONFIG_DIR, HOST_FILE_PATH } from '../constant/constant';
import { execFileSync } from 'child_process';

export const clear = async () => {
    const hosts = storage.getAutoAddedHosts();
    if (!hosts) {
        logger.warn('无自动映射的host内容，进程退出');
        process.exit(0);
    }
    logger.info('自动映射的host内容如下');
    console.log(prettyOutput(hosts.split('\n')));

    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            message: '确定清空packjs自动映射的host内容吗',
            name: 'confirm',
        },
    ]);
    if (!confirm) {
        logger.fatal('进程退出');
        return;
    }
    logger.info('开始清空自动映射的host');
    const hostsContent = fs.readFileSync(HOST_FILE_PATH, 'utf8')?.split(/\r?\n/);
    const newHostsContent = hostsContent.filter((line) => {
        const lineSansComments = line.replace(/#.*/, '');
        const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec(lineSansComments);
        if (matches && matches.length === 3) {
            const ip = matches[1];
            const host = matches[2];
            return !hosts.includes(ip + ' ' + host);
        }
        return true;
    });
    execFileSync('sudo', ['tee', HOST_FILE_PATH], { input: newHostsContent.join('\n') });
    fs.removeSync(path.join(CONFIG_DIR, 'hosts'));
    logger.success('已删除自动映射的host规则');
    process.exit(0);
};

export const add = async () => {};
