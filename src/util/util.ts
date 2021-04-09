import * as fs from 'fs';
import * as path from 'path';
import which from 'which';
/**
 * 文件名遍历
 * @param filePath 需要遍历的文件路径
 * @param filenames
 */
export function lookUpFileNames(filePath, filenames: string[] = []): string[] {
    fs.readdirSync(filePath).forEach((filename) => {
        const fileDir = path.join(filePath, filename);
        if (fs.statSync(fileDir).isDirectory()) {
            lookUpFileNames(fileDir, filenames);
            return filenames;
        }
        filenames.push(filename);
        return filenames;
    });

    return filenames;
}

/**
 * 判断命令是否存在
 * @param cmd
 */
export const cmdExists = async (cmd: string) => {
    return !!which.sync(cmd, { nothrow: true });
};

export function getFormatterDate() {
    const date = new Date();
    let year = date.getFullYear(); //年
    if (year < 1900) year = year + 1900;
    let month: any = date.getMonth() + 1; //月
    if (month < 10) month = '0' + month;
    let day: any = date.getDate(); //日
    if (day < 10) day = '0' + day;
    let hour: any = date.getHours(); //小时
    if (hour < 10) hour = '0' + hour;
    let minute: any = date.getMinutes(); //分钟
    if (minute < 10) minute = '0' + minute;
    let second: any = date.getSeconds(); //秒
    if (second < 10) second = '0' + second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}${date.getMilliseconds()}`;
}

export function ignoreExtConfiguration(options) {
    const extConfiguration = [
        'auto',
        'https',
        'host',
        'open',
        'clean',
        'html',
        'ts',
        'jsx',
        'tsx',
        'less',
        'mobile',
        'cssModules',
        'cssLoader',
        'alias',
        'outputPath',
        'publicPath',
        'postcssPlugins',
        'extraBabelPresets',
        'extraBabelPlugins',
        'before',
    ];
    extConfiguration.forEach((key) => delete options[key]);
    return options;
}
