// 浏览器预览时没有 electron，用 try/catch 兜底
let ipcRenderer = null
try { ipcRenderer = require('electron').ipcRenderer } catch (e) { ipcRenderer = null }

// 33 个动作（文件名即动作名）
const GIFS = [
  '啊啊啊啊啊.gif', '宝贝.GIF', '抱着转圈.gif', '蹦蹦.gif', '蹦蹦跳跳.gif',
  '擦汗.gif', '吃棒棒糖.gif', '吃冰淇淋.gif', '吃吃吃.gif', '吃苹果.gif',
  '揣手.gif', '荡秋千.gif', '多啦a梦.gif', '放水.gif', '浇水.gif',
  '搅咖啡.gif', '哭哭.gif', '冒出.gif', '骑水果.gif', '骑车车.gif',
  '让你尝尝我的厉害.gif', '抬手.gif', '抬手1.gif', '躺着吃.gif', '玩手机.gif',
  '闻闻.gif', '小恐龙.gif', '小兔子鞋子.gif', '摇摇马.gif', '自拍.gif',
  '撑着脸.gif', '撑着脸脸.gif', '锤锤你.gif',
]

const img = document.getElementById('pet-img')
let index = Math.floor(Math.random() * GIFS.length)

function show(i) {
  index = (i + GIFS.length) % GIFS.length
  img.src = 'assets/gifs/' + encodeURI(GIFS[index])
}

show(index)

// 拖拽 + 点击（移动没超过阈值算点击 → 切换动作）
let dragging = false
let moved = false
let lx = 0
let ly = 0

document.addEventListener('mousedown', (e) => {
  dragging = true
  moved = false
  lx = e.screenX
  ly = e.screenY
})

window.addEventListener('mousemove', (e) => {
  if (!dragging) return
  const dx = e.screenX - lx
  const dy = e.screenY - ly
  if (Math.abs(dx) + Math.abs(dy) > 3) moved = true
  if (ipcRenderer) ipcRenderer.send('move-window', dx, dy)
  lx = e.screenX
  ly = e.screenY
})

window.addEventListener('mouseup', () => {
  const wasClick = dragging && !moved
  dragging = false
  if (wasClick) show(index + 1)   // 左键点击：切下一个动作
})

document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  if (ipcRenderer) ipcRenderer.send('show-context-menu')
})

// 主进程菜单发来的切换指令
if (ipcRenderer) {
  ipcRenderer.on('switch-gif', (_e, mode) => {
    if (mode === 'next') show(index + 1)
    else if (mode === 'prev') show(index - 1)
    else if (mode === 'random') show(Math.floor(Math.random() * GIFS.length))
    else if (typeof mode === 'number') show(mode)
  })
}
