import chalk from 'chalk';
import ora from 'ora';
import { format } from 'util';
import * as Debug from 'debug';

/**
 * constant
 */
const PREFIX = 'pack';
const SEP = chalk.gray('·');

class Logger {
    private spinner = ora();
    public formatter = (msg) => {
        return `[${PREFIX}]: ` + format.apply(format, msg);
    };
    public loading(...msg) {
        if (Debug.enabled('pack')) {
            this.spinner.info(chalk.yellow(this.formatter(msg.concat('...'))));
        } else {
            this.spinner.start(chalk.yellow(this.formatter(msg.concat('...'))));
        }
    }
    public success = (...str: any) => {
        const lastArg = str[str.length - 1];
        if (lastArg && lastArg.simple) {
            str.pop();
            return console.log(chalk.green(format.apply(format, str)));
        }
        this.spinner.succeed(chalk.green(this.formatter(str)));
    };
    public info = (...str: any) => {
        const lastArg = str[str.length - 1];
        if (lastArg && lastArg.simple) {
            str.pop();
            return console.log(chalk.blue(format.apply(format, str)));
        }
        this.spinner.info(chalk.blue(this.formatter(str)));
    };
    public warn = (...str: any) => {
        const lastArg = str[str.length - 1];
        if (lastArg && lastArg.simple) {
            str.pop();
            return console.log(chalk.yellow(format.apply(format, str)));
        }
        this.spinner.warn(chalk.yellow(this.formatter(str)));
    };
    public fatal = (...msg) => {
        this.spinner.stopAndPersist();
        this.spinner.fail(chalk.red(this.formatter(msg)));
        process.exit(1);
    };
    public error = (...msg) => {
        this.spinner.stopAndPersist();
        this.spinner.fail(chalk.red(this.formatter(msg)));
    };
    public text = (...msg: any) => {
        this.spinner.text = format.apply(format, msg);
    };
}

export default new Logger();
