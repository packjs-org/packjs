import logger from '../util/logger';
import path from 'path';
import { existsSync } from 'fs';
import { lookUpFileNames } from '../util/util';

export default async (mode, args) => {
    let userConfig;
    logger.loading('正在读取packjs配置');
    const filePath = path.resolve('pack.js');
    if (!existsSync(filePath)) {
        logger.warn('packjs配置文件不存在，使用默认配置');
    } else {
        logger.success('packjs配置读取完成');
        userConfig = require(filePath);
    }

    if (Array.isArray(userConfig)) {
        logger.fatal('not support multiple configurations yet');
        return;
    }

    if (typeof userConfig === 'function') {
        userConfig = await userConfig(mode, {
            ...args,
            isDev: mode === 'development',
            isProd: (process.env.BUILD_GIT_BRANCH || '').startsWith('publish'),
        });
    }

    // userConfig
    userConfig = Object.assign({ auto: true, clean: true }, userConfig);
    if (userConfig.auto) {
        userConfig = Object.assign(autoGeneratorUserConfig(), userConfig);
    }

    return userConfig;
};

function autoGeneratorUserConfig() {
    const filenames = lookUpFileNames(path.resolve('src'));
    const tmpConfig = {} as any;
    filenames.forEach((name) => {
        if (name.endsWith('.ts')) {
            tmpConfig.ts = true;
        }
        if (name.endsWith('.tsx')) {
            tmpConfig.ts = true;
            tmpConfig.jsx = true;
        }
        if (name.endsWith('.jsx')) {
            tmpConfig.jsx = true;
        }
        if (name.endsWith('.css')) {
            tmpConfig.css = true;
        }
        if (name.endsWith('.less')) {
            tmpConfig.less = true;
        }
    });
    return tmpConfig;
}
