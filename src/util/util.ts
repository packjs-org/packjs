import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
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
    return new Promise((resolve) => spawn('type', [cmd]).on('close', (code) => resolve(!code)));
};
