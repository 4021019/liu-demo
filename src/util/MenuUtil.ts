import { electron } from './BaseUtil';

export const { remote } = electron;
export const { Menu, MenuItem } = remote;

export const createMenu = (itemList: Electron.MenuItem[]): Electron.Menu => {
  const menu = new Menu();
  if (itemList) {
    itemList.forEach(item => {
      menu.append(item);
    });
    return menu;
  }
  return menu;
};

export const createSepItem = (): Electron.MenuItem => {
  return new MenuItem({ type: 'separator' });
};

export const createItem = (
  options: Electron.MenuItemConstructorOptions,
): Electron.MenuItem => {
  return new MenuItem(options);
};

export const popMenu = (menu: Electron.Menu): void => {
  menu.popup({ window: remote.getCurrentWindow() });
};
