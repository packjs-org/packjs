import * as devcert from 'devcert';
import { VALID_DOMAIN } from 'devcert/dist/constants';
import * as storage from '../util/storage';
import logger from '../util/logger';
import { DEFAULT_DEV_SERVER_CONFIG } from './defaultConfig';
import { HOST_FILE_PATH } from '../constant/constant';
import * as fs from 'fs';
import { execFileSync } from 'child_process';

/**
 * devServerConfig
 * @param userConfig
 */
export const generateDevServerOption = async (userConfig) => {
    return Object.assign(
        DEFAULT_DEV_SERVER_CONFIG,
        await getHttpsOption(userConfig),
        userConfig.devServer,
        { open: userConfig.open ? 'Google Chrome' : false },
        userConfig.host && { host: userConfig.host },
        userConfig.https && { https: userConfig.https }
    );
};

const getHttpsOption = async (userConfig) => {
    const useHttps = userConfig.https || userConfig.devServer.https;
    if (!useHttps) return {};
    const httpsConfig: any = { https: true, port: 443 };
    if (!userConfig.host || !VALID_DOMAIN.test(userConfig.host)) {
        return httpsConfig;
    }

    logger.info('检测到启用https模式');

    logger.info(`开始自动安装https证书，domain：${userConfig.host}`);
    const ssl = await devcert.certificateFor(userConfig.host, { skipHostsFile: true });
    httpsConfig.open = true;
    httpsConfig.key = ssl.key;
    httpsConfig.cert = ssl.cert;
    logger.success('https证书安装完成');

    logger.info(`开始检查host映射`);
    const hostsContent = fs.readFileSync(HOST_FILE_PATH, 'utf8');
    const hostRule = `127.0.0.1 ${userConfig.host}`;
    if (hostsContent.includes(hostRule)) {
        logger.success('host映射规则检测完成');
    } else {
        logger.warn('检测到当前host规则不存在');
        logger.info(`开始自动添加host映射：127.0.0.1 ${userConfig.host}`);
        execFileSync('sudo', ['tee', '-a', HOST_FILE_PATH], { input: `${hostRule}\n` });
        storage.addHost(`127.0.0.1 ${userConfig.host}`);
        logger.success('hosts映射添加完成');
    }

    return httpsConfig;
};
