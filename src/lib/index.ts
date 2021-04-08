import ip from 'ip';
import path from 'path';
import fs from 'fs-extra';
import morgan from 'morgan';
import rimraf from 'rimraf';
import webpack from 'webpack';
import prettier from 'prettier';
import relative from 'relative';
import readline from 'readline';
import clone from 'lodash.clonedeep';
import getRepoInfo from 'git-repo-info';
import prettyOutput from 'prettyoutput';
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
import applyWebpackOptionsDefaults = webpack.config.applyWebpackOptionsDefaults;
import getNormalizedWebpackOptions = webpack.config.getNormalizedWebpackOptions;

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
        logger.info('开始检查git分支版本信息');
        const gitInfo = getRepoInfo();
        if (!gitInfo.branch?.startsWith('daily/')) {
            logger.warn('git分支不合法或不存在，跳过更新version');
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
        logger.info('开始检查依赖项完整性');

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
            const webpackOptions = clone(this.webpackConfig);
            webpackOptions.module.rules.map((rule) => {
                rule.test = rule.test && rule.test.toString();
                rule.exclude = rule.exclude && rule.exclude.toString();
            });
            console.log(prettyOutput(webpackOptions, { maxDepth: 10 }));
        }

        const compiler = webpack(this.webpackConfig, () => {});
        const devServerConfig = this.webpackConfig.devServer;
        const protocol = this.userConfig.https ? 'https' : 'http';
        const openUrl = `${protocol}://${devServerConfig.host}:${devServerConfig.port}`;
        compiler.hooks.done.tap('afterDone', () => {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);

            const url1 = `- 本地：${openUrl}`;
            const url2 = `- 局域网：${protocol}://${ip.address()}:${devServerConfig.port}`;
            logger.success('本地开发 server 启动完毕，调试入口链接: ');
            logger.info('  ' + url1 + '\n  ' + url2, { simple: true });
        });

        const server = new WebpackDevServer(compiler, devServerConfig);
        server.app.use(morgan('short', { stream: { write: (line) => logger.info(line.slice(0, line.length - 1)) } }));
        server.listen(devServerConfig.port, '0.0.0.0');
    };

    build = async (args) => {
        await this.run('production', args);
        if (args.print) {
            console.log();
            logger.info('webpack配置详情如下:');
            const webpackOptions = clone(this.webpackConfig);
            webpackOptions.module.rules.map((rule) => {
                rule.test = rule.test && rule.test.toString();
                rule.exclude = rule.exclude && rule.exclude.toString();
            });
            console.log(prettyOutput(webpackOptions, { maxDepth: 10 }));
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
