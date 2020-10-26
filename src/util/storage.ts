import * as fs from 'fs-extra';
import * as path from 'path';
import { CONFIG_DIR } from '../constant/constant';

export function getAutoAddedHosts(): string {
    const configPath = path.join(CONFIG_DIR, 'hosts');
    fs.ensureFileSync(configPath);
    return fs.readFileSync(configPath, 'utf8') || '';
}

export function addHost(str) {
    const configPath = path.join(CONFIG_DIR, 'hosts');
    fs.ensureFileSync(configPath);
    const content = fs.readFileSync(configPath, 'utf8');
    if (content) {
        fs.writeFileSync(configPath, content + '\n' + str);
    } else {
        fs.writeFileSync(configPath, str);
    }
}
