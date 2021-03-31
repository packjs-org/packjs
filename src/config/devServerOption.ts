import { DEFAULT_DEV_SERVER_CONFIG } from './defaultConfig';

/**
 * devServerConfig
 * @param userConfig
 */
export const generateDevServerOption = async (userConfig) => {
    return Object.assign(
        DEFAULT_DEV_SERVER_CONFIG,
        userConfig.devServer,
        { open: userConfig.open ? 'Google Chrome' : false },
        userConfig.host && { host: userConfig.host },
        userConfig.https && { https: userConfig.https }
    );
};
