const fs = window.require('fs');
const os = window.require('os');

const t = fs.readFile(
  os.homedir() + '/test.json',
  'utf-8',
  (err: any, data: any) => {
    if (err) throw err;
    console.log(data);
  },
);

export const systemConfig = {
  homedir: os.homedir(),
};
