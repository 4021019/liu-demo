export const fs = window.require('fs');
export const os = window.require('os');
export const path = window.require('path');

export const mkdir = (dir: string) => {
  fs.mkdirSync(dir, {
    recursive: true,
  });
};
