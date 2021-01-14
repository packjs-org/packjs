import path from 'path';
import chalk from 'chalk';
import relative from 'relative';
import { existsSync } from 'fs';
import prettier from 'prettier';
import merge from 'webpack-merge';
import { lookUpFileNames } from '../util/util';
import { depMap } from './configDepMap';
import { checkInstall, install } from '../util/install';
import logger from '../util/logger';
import { IPackOptions } from '../interface';
import { CONFIG_FILE, DEFAULT_USER_CONFIG, DEFAULT_WEBPACK_CONFIG } from './defaultConfig';
import { generateDevServerOption } from './devServerOption';
import { generatePlugins } from './pluginsOption';
import { generateCSSRules } from './cssRulesOption';
import { generateJSRules } from './jsRulesOption';
import * as fs from 'fs';
import { generateFileRules } from './fileRulesOption';

export class Config {
    args = {};
    isDev = false;
    env = 'development' as 'development' | 'production' | 'none';
    devServerOption;
    webpackOption;
    userConfig: IPackOptions & Function;
    config = { plugins: [], module: { rules: [] } };

    /**
     *
     * @param env production|development
     * @param args cli args
     */
    constructor({ env, args }) {
        this.env = env;
        this.args = args;
        this.isDev = env === 'development';
    }

    async init() {
        logger.info('开始读取packjs配置');
        const filePath = path.resolve(CONFIG_FILE);
        if (!existsSync(filePath)) {
            logger.warn('packjs配置文件不存在，使用默认配置');
        } else {
            logger.success('读取packjs配置完成');
            this.userConfig = require(filePath);
        }

        if (Array.isArray(this.userConfig)) {
            logger.fatal('not support multiple configurations yet');
            return;
        }

        if (typeof this.userConfig === 'function') {
            this.userConfig = await this.userConfig(this.env, {
                ...this.args,
                isDev: this.isDev,
                isProd: (process.env.BUILD_GIT_BRANCH || '').startsWith('publish'),
            });
        }

        // userConfig
        this.userConfig = {
            ...DEFAULT_USER_CONFIG,
            ...this.autoGeneratorUserConfig(),
            ...this.userConfig,
            ...{ host: this.userConfig.host?.trim().replace(/[\s;]/g, '') },
        };

        // devServerConfig
        if (this.isDev) {
            this.devServerOption = await generateDevServerOption(this.userConfig);
        }

        await this.auto();

        await this.getWebpackConfig();
    }

    async auto() {
        //update tsconfig alias in ts mode
        if (this.userConfig.alias && (this.userConfig.ts || this.userConfig.tsx)) {
            logger.info('自动更新tsconfig.paths');
            const tsconfigFilePath = path.resolve(process.cwd(), 'tsconfig.json');
            if (!fs.existsSync(tsconfigFilePath)) {
                logger.warn('tsconfig.json不存在，跳过更新alias');
            } else {
                const tsconfig = require(tsconfigFilePath);
                tsconfig.compilerOptions = tsconfig.compilerOptions || {};
                tsconfig.compilerOptions.baseUrl = '.';
                tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
                Object.entries(this.userConfig.alias).forEach(([k, v]) => {
                    tsconfig.compilerOptions.paths[k + '/*'] = [relative.toBase(process.cwd(), v) + '/*'];
                });
                fs.writeFileSync(tsconfigFilePath, prettier.format(JSON.stringify(tsconfig), { parser: 'json' }));
                logger.success('tsconfig.paths更新完成');
            }
        }

        // install deps
        await this.installDependencies();
    }

    autoGeneratorUserConfig() {
        if (!this.userConfig.auto) return {};
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

    async getWebpackConfig() {
        generatePlugins(this.userConfig, this.config);
        generateJSRules(this.userConfig, this.config);
        generateCSSRules({ ...this.userConfig, isDev: this.isDev }, this.config);
        generateFileRules(this.userConfig, this.config);
        this.webpackOption = merge(
            DEFAULT_WEBPACK_CONFIG,
            this.isDev && {
                watch: true,
                watchOptions: { aggregateTimeout: 1000, ignored: 'node_modules/**' },
            },
            this.config,
            {
                mode: this.env,
                entry: this.userConfig.entry,
                externals: this.userConfig.externals,
                resolve: { alias: this.userConfig.alias },
                output: { path: this.userConfig.outputPath },
            },
            this.userConfig.webpack || {}
        );

        if (typeof this.userConfig.before === 'function') {
            this.webpackOption = await this.userConfig.before(this.webpackOption);
        }
    }

    async installDependencies() {
        logger.info('开始检查依赖项完整性');

        const needInstalled: string[] = [];
        const dependencies = [];

        if (this.userConfig.html) {
            dependencies.push(depMap.html);
        }

        if ((this.userConfig.ts && this.userConfig.jsx) || this.userConfig.tsx) {
            dependencies.push(depMap.ts);
            dependencies.push(depMap.jsx);
        } else if (this.userConfig.ts) {
            dependencies.push(depMap.ts);
        } else if (this.userConfig.jsx) {
            dependencies.push(depMap.jsx);
        }

        // @ts-ignore
        if (this.userConfig.css || this.userConfig.less || this.userConfig.mobile || this.userConfig.cssModules) {
            dependencies.push(depMap.css);
        }
        if (this.userConfig.mobile) {
            dependencies.push(depMap.mobile);
        }
        if (this.userConfig.less) {
            dependencies.push(depMap.less);
        }

        dependencies.map((deps) => {
            deps.dependencies = deps.dependencies.filter((dep) => !checkInstall(dep));
            if (deps.dependencies.length) {
                [].push.apply(needInstalled, deps.dependencies);
                const msg = `   ${chalk.red('x)')}${deps.tip}相关依赖：${deps.dependencies}`;
                logger.warn(msg, { simple: true });
            }
        });

        if (dependencies.filter((deps) => deps.dependencies.length > 0).length === 0) {
            logger.success('检查相关依赖通过');
            return;
        }
        logger.loading('检查到依赖缺失，正在安装依赖');
        await install(needInstalled);
        logger.success('依赖安装完成');
    }
}
