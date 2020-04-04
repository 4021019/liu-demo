import { ipcMain } from 'electron';

ipcMain.on('synchronous-message', (event, arg) => {
  event.returnValue = 'pong';
});
