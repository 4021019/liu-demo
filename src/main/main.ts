import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import './ping.ts';

const ENV_DEV = 'development';
const KEY_F12 = 'F12';

function createWindow() {
  // 创建浏览器窗口
  console.log(path.join(__dirname, 'preload.ts'));
  const win = new BrowserWindow({
    width: 1366,
    minWidth: 680,
    height: 768,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === ENV_DEV) {
    win.loadURL('http://localhost:8000/#/');
  } else {
    // 并且为你的应用加载index.html
    win.loadFile('./dist/index.html');
  }
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。

app.whenReady().then(() => {
  let win = createWindow();
  if (win && process.env.NODE_ENV === ENV_DEV) {
    win.webContents.openDevTools();
    globalShortcut.register(KEY_F12, () => {
      // 打开开发者工具
      console.log('F12 open dev tools');
      win.webContents.openDevTools();
    });
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
