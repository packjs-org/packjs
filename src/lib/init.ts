import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import { existsSync } from 'fs';
import pkg from '../../package.json';
import logger from '../util/logger';

const launchedFromCmd = process.platform === 'win32' && process.env._ === undefined;

export default async (projectName) => {
    const projectPath = projectName ? path.resolve(projectName) : path.resolve();
    if (existsSync(projectPath) && fs.readdirSync(projectPath).length) {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                message: 'project directory already exists, do you want to continue？',
                name: 'confirm',
            },
        ]);
        if (!confirm) {
            logger.fatal('process aborted!');
            return;
        }
    }

    // copy tpl
    fs.copySync(path.resolve(__dirname, '../../template'), projectPath, {
        filter: (_, dist) => {
            logger.success(`   √ create : ${dist}`, { simple: true });
            return true;
        },
    });

    // create package.json
    const _pkg = {
        name: projectName,
        version: '0.0.1',
        description: '',
        scripts: {
            dev: 'pack dev',
            build: 'pack build',
            publish: 'def p',
        },
        license: 'ISC',
        dependencies: {
            '@types/react-dom': '^16.9.5',
            react: '^16.4.1',
            'react-dom': '^16.4.1',
        },
        devDependencies: {
            [pkg.name]: 'latest',
            prettier: '^2.1.2',
            typescript: '^4.0.3',
        },
        tnpm: {
            mode: 'npm',
        },
    };
    fs.outputFileSync(path.resolve(projectPath, 'package.json'), JSON.stringify(_pkg, null, 2));
    logger.success(`   √ create : ${path.resolve(projectPath, 'package.json')}`, { simple: true });

    const dot = launchedFromCmd ? '>' : '$';
    console.log();
    console.log('   install dependencies:');
    console.log('     %s cd %s && npm install', dot, projectName);
    console.log();
    console.log('   run the app:');

    if (launchedFromCmd) {
        console.log('     > SET DEBUG=%s:* & pack dev', projectName);
    } else {
        console.log('     $ DEBUG=%s:* pack dev', projectName);
    }

    return;
};
