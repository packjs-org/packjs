import * as path from 'path';
import logger from '../util/logger';
import fs from 'fs-extra';
import ip from 'ip';
import WebpackDevServer from 'webpack-dev-server';
import getRepoInfo from 'git-repo-info';
import clone from 'lodash.clonedeep';
import morgan from 'morgan';
import prettyOutput from 'prettyoutput';
import webpack from 'webpack';
import rimraf from 'rimraf';
import { version } from '../../package.json';
import { Config } from '../config/config';
import { cmdExists } from '../util/util';

export class Core {
    config: Config;

    constructor() {
        // output tips
        const tips = fs.readFileSync(path.join(__dirname, '../../msg.txt')).toString().replace('{{version}}', version);
        logger.info(tips, { simple: true });
    }

    autoUpdatePackageVersion() {
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

    common = async (env, args) => {
        if (await cmdExists('tnpm')) {
            this.autoUpdatePackageVersion();
        }
        this.config = new Config({ env, args });
        await this.config.init();
    };

    dev = async (args) => {
        await this.common('development', args);
        const compiler = webpack(this.config.webpackOption, () => {});
        if (args.print) {
            console.log();
            logger.info('webpack配置详情如下:');
            const webpackOptions = clone(this.config.webpackOption);
            webpackOptions.module.rules.map((rule) => {
                rule.test = rule.test && rule.test.toString();
                rule.exclude = rule.exclude && rule.exclude.toString();
            });
            console.log(prettyOutput(webpackOptions, { maxDepth: 10 }));

            const devServerOptions = clone(this.config.devServerOption);
            devServerOptions.key = devServerOptions.key && '(too long)';
            devServerOptions.cert = devServerOptions.cert && '(too long)';
            logger.info('webpack dev server配置详情如下:');
            console.log(prettyOutput(devServerOptions, { maxDepth: 10 }));
        }
        compiler.hooks.afterDone.tap('afterDone', () => {
            const protocol = this.config.userConfig.https ? 'https' : 'http';
            const url1 = `- 本地：${protocol}://${this.config.devServerOption.host}:${this.config.devServerOption.port}`;
            const url2 = `- 局域网：${protocol}://${ip.address()}:${this.config.devServerOption.port}`;
            logger.success('本地开发 server 启动完毕，调试入口链接: ');
            logger.info('  ' + url1 + '\n  ' + url2, { simple: true });
        });
        const server = new WebpackDevServer(compiler, this.config.devServerOption);
        server.app.use(morgan('short', { stream: { write: (line) => logger.info(line.slice(0, line.length - 1)) } }));
        server.listen(this.config.devServerOption.port, '0.0.0.0');
    };

    build = async (args) => {
        await this.common('production', args);

        const compiler = webpack(this.config.webpackOption, () => {});
        if (args.print) {
            console.log();
            logger.info('webpack配置详情如下:');
            const webpackOptions = clone(compiler.options);
            webpackOptions.module.rules.map((rule) => {
                rule.test = rule.test && rule.test.toString();
                rule.exclude = rule.exclude && rule.exclude.toString();
            });
            console.log(prettyOutput(webpackOptions, { maxDepth: 10 }));
        }
        compiler.hooks.beforeRun.tap('beforeRun', () => {
            if (this.config.userConfig.clean && compiler.options.output.path!) {
                logger.info('开始清空outputPath');
                logger.success('清空outputPath完成');
                rimraf.sync(path.resolve(process.cwd(), compiler.options.output.path));
            }
        });
        compiler.run(() => {});
    };
}
