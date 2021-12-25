import path from 'path';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import webpack from 'webpack';
import prettier from 'prettier';
import relative from 'relative';
import getRepoInfo from 'git-repo-info';
import WebpackDevServer from 'webpack-dev-server';
import { version } from '../../package.json';
import { cmdExists } from '../util/util';
import logger from '../util/logger';
import { IPackOptions } from '../interface';
import getWebPackConfig from './getWebPackConfig';
import getUserConfig from './getUserConfig';
import { depMap } from './configDepMap';
import { checkInstall, install } from '../util/install';
import chalk from 'chalk';
import * as util from 'util';

export class Core {
    userConfig: IPackOptions & Function;
    webpackConfig;

    constructor() {
        // output tips
        const tips = fs.readFileSync(path.join(__dirname, '../../msg.txt')).toString().replace('{{version}}', version);
        logger.info(tips, { simple: true });
    }

    /**
     * update tsconfig alias in ts mode
     */
    updateTsconfigAlias() {
        const { alias, ts, tsx } = this.userConfig;
        if (alias && (ts || tsx)) {
            logger.info('自动更新tsconfig.paths');
            const tsconfigFilePath = path.resolve(process.cwd(), 'tsconfig.json');
            if (!fs.existsSync(tsconfigFilePath)) {
                logger.warn('tsconfig.json不存在，跳过更新alias');
            } else {
                const tsconfig = require(tsconfigFilePath);
                tsconfig.compilerOptions = tsconfig.compilerOptions || {};
                tsconfig.compilerOptions.baseUrl = '.';
                tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
                Object.entries(alias).forEach(([k, v]) => {
                    tsconfig.compilerOptions.paths[k + '/*'] = [relative.toBase(process.cwd(), v) + '/*'];
                });
                fs.writeFileSync(tsconfigFilePath, prettier.format(JSON.stringify(tsconfig), { parser: 'json' }));
                logger.success('tsconfig.paths更新完成');
            }
        }
    }

    /**
     * update package version in def mode
     */
    async updatePackageVersion() {
        if (!(await cmdExists('tnpm'))) return;
        logger.loading('正在检查git分支版本信息');
        const gitInfo = getRepoInfo();
        if (!gitInfo.branch?.startsWith('daily/')) {
            logger.warn('跳过更新package.version');
            return;
        }
        const version = gitInfo.branch.split('/')[1];
        const pkgPath = path.join(process.cwd(), 'package.json');
        const pkgObj = require(pkgPath);
        if (pkgObj.version !== version) {
            fs.outputJsonSync(pkgPath, Object.assign(pkgObj, { version }), { spaces: 2 });
            logger.success('根据分支信息自动更新项目 package.json 的 version 字段: %s', version);
        }
    }

    /**
     * auto install dep
     */
    async installDependencies() {
        logger.info('正在检查依赖项完整性');

        // @ts-ignore
        const { html, cssModules, css, ts, tsx, jsx, mobile, less } = this.userConfig;
        const needInstalled: string[] = [];
        const dependencies = [];

        if (html) {
            dependencies.push(depMap.html);
        }

        if ((ts && jsx) || tsx) {
            dependencies.push(depMap.ts);
            dependencies.push(depMap.jsx);
        } else if (ts) {
            dependencies.push(depMap.ts);
        } else if (jsx) {
            dependencies.push(depMap.jsx);
        }

        if (css || less || mobile || cssModules) {
            dependencies.push(depMap.css);
        }
        if (mobile) {
            dependencies.push(depMap.mobile);
        }
        if (less) {
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

    async run(mode, args) {
        this.userConfig = await getUserConfig(mode, args);
        this.webpackConfig = await getWebPackConfig(mode, args, this.userConfig);
        this.updateTsconfigAlias();
        await this.updatePackageVersion();
        await this.installDependencies();
    }

    dev = async (args) => {
        await this.run('development', args);

        if (args.print) {
            console.log();
            logger.info('webpack配置详情如下:');
            logger.success(util.inspect(this.webpackConfig, false, null, true), { simple: true });
        }

        const compiler = webpack(this.webpackConfig, (err) => err && console.log(err.message));
        const devServerConfig = this.webpackConfig.devServer;

        if (!compiler) {
            logger.error('webpack running error!');
            return;
        }

        new WebpackDevServer(devServerConfig, compiler).start().then();
    };

    build = async (args) => {
        await this.run('production', args);

        if (args.print) {
            console.log();
            logger.info('webpack配置详情如下:');
            logger.success(util.inspect(this.webpackConfig, false, null, true), { simple: true });
        }

        const outputPath = this.webpackConfig.output?.path || path.join(process.cwd(), 'dist');

        if (this.userConfig.clean && outputPath) {
            logger.loading('正在清理outputPath');
            rimraf.sync(outputPath);
            logger.success('已清理outputPath');
        }
        const compiler = webpack(this.webpackConfig);
        compiler.run(() => {});
    };
}
