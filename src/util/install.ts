import { spawn } from 'child_process';
import { cmdExists } from './util';

export const install = async (names: string[]) => {
    const npmClient = (await cmdExists('tnpm')) ? 'tnpm' : 'npm';
    return new Promise((resolve) =>
        spawn(npmClient, ['i', `--prefix ${process.cwd()}`, '--no-save'].concat(names)).on('close', resolve)
    );
};

export const checkInstall = (name) => {
    const arr = name.split('@');
    if (arr[0] == '') {
        arr[1] = '@' + arr[1];
        arr.shift();
    }

    try {
        const moduleId = require.resolve(arr[0], { paths: [process.cwd()] });
        delete require.cache[moduleId];
        return true;
    } catch (e) {
        return false;
    }
};
