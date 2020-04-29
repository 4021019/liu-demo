import { IPane } from '@/components/PageTab/type';
import { v4 as uuidV4 } from 'uuid';

export const fs = window.require('fs');
export const os = window.require('os');
export const path = window.require('path');

/**
 * 创建文件夹
 * @param dir 目录
 */
export const mkdir = (dir: string) => {
  fs.mkdirSync(dir, {
    recursive: true,
  });
};

/**
 * uuid v4 随机生成 文件id
 */
export const fileId = (): string => {
  return uuidV4();
};

export const readFileRecursion = (
  dir: string,
  filesList: Map<String, IPane>,
) => {
  const files = fs.readdirSync(dir);
  files.forEach((item: any, index: any) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(item);
      const value = readText(path.join(dir, item));
      filesList.set(item, {
        key: item,
        tab: item,
        value: value,
        type: 'codemirror',
      });
    }
  });
  return filesList;
};

export const readText = (dir: string): string => {
  const files = fs.readdirSync(dir);
  let data = '';
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    var fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      if ('text.txt' === file) {
        data = fs.readFileSync(fullPath, 'utf-8');
        break;
      }
    }
  }
  return data;
};
