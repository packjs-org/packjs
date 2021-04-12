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

export function ignoreExtConfiguration(options) {
    const extConfiguration = [
        'auto',
        'https',
        'host',
        'open',
        'clean',
        'html',
        'css',
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
