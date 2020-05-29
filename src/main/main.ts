import { app, BrowserWindow, ipcMain, Menu, MenuItem, Tray } from 'electron';
import knex, { CreateTableBuilder } from 'knex';
import { menubar } from 'menubar';
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
    win.loadURL('http://localhost:8000/#/editor');
  } else {
    win.loadFile('./public/index.html');
  }

  win.webContents.openDevTools();
  // win.on('close', () => {
  //   dialog.showErrorBox('关闭确认', '');
  // });
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。

app.whenReady().then(() => {
  let win = createWindow();
  if (process.env.NODE_ENV === ENV_DEV) {
    const appIcon = new Tray('./public/x.png');
    const mb = menubar({
      tray: appIcon,
      index: 'http://localhost:8000/#/setting',
      browserWindow: {
        width: 480,
        height: 680,
        webPreferences: {
          nodeIntegration: true,
          preload: path.join(__dirname, 'preload.js'),
        },
      },
    });
    mb.on('ready', () => {
      console.log('app is ready');
      // your app code here
    });

    // appIcon.on('click', () => {
    //   const {width, height} = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workAreaSize;
    //   console.log(screen.getAllDisplays())
    //   const [defaultWidth, defaultHeight] = [width, height].map(x => Math.round((x * 3) / 4));
    //   const WINDOW_WIDTH = defaultWidth - 350;
    //   const WINDOW_HEIGHT = defaultHeight;
    //   const HORIZ_PADDING = 15;
    //   const VERT_PADDING = 15;

    //   const cursorPosition = screen.getCursorScreenPoint();
    //   const primarySize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workAreaSize;
    //   const trayPositionVert = cursorPosition.y >= primarySize.height / 2 ? 'bottom' : 'top';
    //   const trayPositionHoriz = cursorPosition.x >= primarySize.width / 2 ? 'right' : 'left';
    //   win.setPosition(getTrayPosX(), getTrayPosY());
    //   if (win.isVisible()) {
    //     win.hide();
    //   } else {
    //     win.show();
    //   }
    //   // 计算位置
    //   function getTrayPosX() {
    //     const horizBounds = {
    //       left: cursorPosition.x - (WINDOW_WIDTH / 2),
    //       right: cursorPosition.x + (WINDOW_WIDTH / 2)
    //     };
    //     if (trayPositionHoriz === 'left') {
    //       return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left;
    //     }
    //     return horizBounds.right >= primarySize.width ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH : horizBounds.right - WINDOW_WIDTH;
    //   }
    //   function getTrayPosY() {
    //     return trayPositionVert === 'bottom' ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING;
    //   }
    // });
  } else {
    // todo
  }

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

var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('./public/demo.db');
// db.serialize(function() {
//   db.run("CREATE TABLE if not exists lorem (info TEXT)");

//   // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   // for (var i = 0; i < 10; i++) {
//   //     stmt.run("Ipsum " + i);
//   // }
//   // stmt.finalize();

// });
// db.close();

var knexClient = knex({
  client: 'sqlite3',
  connection: {
    filename: './public/demo.db',
  },
});

knexClient.schema.hasTable('users').then(o => {
  console.log(o);
});

const who = (table: CreateTableBuilder) => {
  table.timestamp('creation_date').defaultTo(knexClient.fn.now());
  table.timestamp('last_update_date').defaultTo(knexClient.fn.now());
  table.bigInteger('created_by').defaultTo(-1);
  table.bigInteger('last_updated_by').defaultTo(-1);
};

knexClient.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return knexClient.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      who(table);
    });
  }
});

knexClient
  .select()
  .from('lorem')
  .then(o => {
    console.log(o);
  });
