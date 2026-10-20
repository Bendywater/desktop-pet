// 浏览器预览时没有 electron，用 try/catch 兜底
let ipcRenderer = null
try { ipcRenderer = require('electron').ipcRenderer } catch (e) { ipcRenderer = null }

const pet = document.getElementById('pet')
const bubble = document.getElementById('bubble')

const PHRASES = [
  '你好呀～',
  '今天也要加油哦！',
  '摸摸头～',
  '我在盯着你呢',
  '要不要歇会儿？',
  '喵～',
]

let dragging = false
let moved = false
let lastX = 0
let lastY = 0
let bubbleTimer = null

pet.addEventListener('mousedown', (e) => {
  dragging = true
  moved = false
  lastX = e.screenX
  lastY = e.screenY
})

window.addEventListener('mousemove', (e) => {
  if (!dragging) return
  const dx = e.screenX - lastX
  const dy = e.screenY - lastY
  if (Math.abs(dx) + Math.abs(dy) > 3) moved = true
  if (ipcRenderer) ipcRenderer.send('move-window', dx, dy)
  lastX = e.screenX
  lastY = e.screenY
})

window.addEventListener('mouseup', () => {
  const wasClick = dragging && !moved
  dragging = false
  if (wasClick) speak()
})

pet.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  if (ipcRenderer) ipcRenderer.send('show-context-menu')
})

function speak() {
  const text = PHRASES[Math.floor(Math.random() * PHRASES.length)]
  bubble.textContent = text
  bubble.classList.add('show')
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2600)
}
