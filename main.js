const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron')
const path = require('path')

let win = null
let tray = null

function createWindow() {
  win = new BrowserWindow({
    width: 220,
    height: 220,
    transparent: true,     // 背景透明，只显示角色本体
    frame: false,          // 去掉系统标题栏
    alwaysOnTop: true,     // 永远浮在其他窗口之上
    resizable: false,
    hasShadow: false,      // 去掉透明区域的阴影框
    skipTaskbar: true,     // 不在任务栏显示
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  })
  win.setAlwaysOnTop(true, 'screen-saver') // 连屏保之上也置顶
  // 在所有桌面空间（包括全屏空间）都显示，这样全屏应用也盖不住桌宠
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  win.loadFile('gif-pet.html')
  win.on('closed', () => { win = null })
}

function send(mode) {
  if (win) win.webContents.send('switch-gif', mode)
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'))
  tray = new Tray(icon)
  tray.setToolTip('一二布布桌宠')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '下一个动作', click: () => send('next') },
    { label: '随机动作', click: () => send('random') },
    { type: 'separator' },
    { label: '退出桌宠', click: () => app.quit() },
  ]))
  tray.on('click', () => { if (win) win.show() })
}

// 渲染进程发来的拖拽增量，移动窗口
ipcMain.on('move-window', (_e, dx, dy) => {
  if (!win) return
  const [x, y] = win.getPosition()
  win.setPosition(x + dx, y + dy)
})

// 右键菜单
ipcMain.on('show-context-menu', () => {
  Menu.buildFromTemplate([
    { label: '下一个动作', click: () => send('next') },
    { label: '上一个动作', click: () => send('prev') },
    { label: '随机动作', click: () => send('random') },
    { type: 'separator' },
    { label: '退出桌宠', click: () => app.quit() },
  ]).popup({ window: win })
})

app.whenReady().then(() => {
  createWindow()
  createTray()
})

// 桌宠常驻：关掉窗口不退出，只从托盘/右键菜单退出
app.on('window-all-closed', () => { /* keep running */ })

app.on('activate', () => { if (!win) createWindow() })
