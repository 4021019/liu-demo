import { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } from 'electron';
import path from 'path';
import './ping.ts';

const ENV_DEV = 'development';
const KEY_F12 = 'F12';

const menu = new Menu();
menu.append(new MenuItem({ type: 'separator' }));
menu.append(
  new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }),
);

function createWindow() {
  // 创建浏览器窗口
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

  win.webContents.openDevTools();
  win.on('close', () => {
    dialog.showErrorBox('gfafasdf', '');
  });
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。

app.whenReady().then(() => {
  let win = createWindow();
  if (win && process.env.NODE_ENV === ENV_DEV) {
    // win.webContents.openDevTools();
    // globalShortcut.register(KEY_F12, () => {
    //   // 打开开发者工具
    //   win.webContents.openDevTools();
    // });
  }
});

// app.on('browser-window-created', (event, win) => {
//   win.webContents.on('context-menu', (e, params) => {
//     menu.popup(win, params.x, params.y)
//   })
// })

// ipcMain.on('show-context-menu', event => {
//   const win = BrowserWindow.fromWebContents(event.sender);
//   menu.popup(win);
// });

ipcMain.on('xxxx', (event, arg) => {
  console.log(arg); // prints "ping"
  event.returnValue = 'pong';
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
