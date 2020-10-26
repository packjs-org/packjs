import * as path from 'path';
import * as os from 'os';

export const CONFIG_DIR = path.join(os.homedir(), '.packjs');

export const WINDOWS = process.platform === 'win32';
export const HOST_FILE_PATH = WINDOWS ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';
