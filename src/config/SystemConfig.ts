import { mkdir } from '@/util/FileUtil';
export const fs = window.require('fs');
export const os = window.require('os');
export const path = window.require('path');

const APP_BASE_DIR = '.liuDemo';
const SYS_CONFIG_JSON = 'sys-config.json';
const DEFAULT_CHARSET = 'utf-8';
const CONFIG_NAME = `${os.homedir}${path.sep}${APP_BASE_DIR}${path.sep}${SYS_CONFIG_JSON}`;
const APP_DIR = `${os.homedir}${path.sep}${APP_BASE_DIR}`;
const DEFAULT_CONFIG = {
  author: {
    name: 'liuDemo',
    email: '8416681@qq.com',
  },
  docSetting: {
    baseDir: `${APP_DIR}${path.sep}doc`,
  },
};

function readFileRecursion(dir: string, filesList: any[]) {
  const files = fs.readdirSync(dir);
  files.forEach((item: any, index: any) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileRecursion(path.join(dir, item), filesList); //递归读取文件
    } else {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

function readDir(dir: string, filesList: any[]) {
  const files = fs.readdirSync(dir);
  files.forEach((item: any, index: any) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

let filesList: any[] = [];
mkdir(APP_DIR);

let config: any;
try {
  const data = fs.readFile(CONFIG_NAME, 'utf-8');
  config = JSON.parse(data);
} catch (err) {
  fs.writeFile(CONFIG_NAME, JSON.stringify(DEFAULT_CONFIG), function(err: any) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
  config = DEFAULT_CONFIG;
}
mkdir(config.docSetting.baseDir);

console.log(config);
readFileRecursion(APP_DIR, filesList);
console.log(filesList);

let filesList2: any[] = [];
readDir(config.docSetting.baseDir, filesList2);
console.log(filesList2);

export const systemConfig = {
  homedir: os.homedir(),
  appdir: APP_DIR,
  configname: CONFIG_NAME,
  charset: DEFAULT_CHARSET,
  baseconfig: config,
  docdir: config.docSetting.baseDir,
};
