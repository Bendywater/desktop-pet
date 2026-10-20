# 桌宠（Desktop Pet）

一个基于 Electron 的跨平台桌面宠物。角色以透明、无边框、置顶的小窗口浮在桌面上，支持拖拽移动、点击切换动作、右键菜单和托盘控制。

## 效果预览

![桌宠效果演示](docs/demo.gif)

## 特性

- 透明无边框置顶窗口，只显示角色本体，不挡桌面
- 左键点击切换动作，按住拖拽移动位置
- 右键菜单：上/下一个动作、随机动作、退出
- 托盘图标：切换动作 / 退出
- 跨桌面空间显示（macOS 全屏应用也盖不住）
- GIF 循环与透明由浏览器原生支持，无需额外渲染依赖

## 快速开始

```bash
npm install
npm start
```

macOS 首次运行可能被 Gatekeeper 拦截，见下方「常见问题」。

## 目录结构

```
desktop-pet/
├── main.js           # Electron 主进程：透明窗口 + 托盘 + IPC
├── gif-pet.html      # 桌宠页面（GIF 角色，主入口）
├── gif-pet.css       # 桌宠样式
├── gif-pet.js        # 桌宠交互逻辑（切换动作 / 拖拽 / 右键）
├── index.html        # 附：纯 CSS 绘制的角色 demo（无需素材）
├── pet.css / pet.js  # 附：CSS 角色的样式与逻辑
├── typing.html       # 附：CSS 打字动画 demo
├── assets/
│   ├── gifs/         # 角色 GIF 素材（需自行准备，见下）
│   └── tray.png      # 托盘图标
├── .gitignore
└── package.json
```

## 添加角色素材

角色动画用 GIF 实现，把透明背景的 GIF 放进 `assets/gifs/` 目录，然后在 `gif-pet.js` 顶部的 `GIFS` 数组里加上文件名即可。

素材要求：

- 透明背景（带 alpha 通道）
- 建议尺寸 200~1000px，程序会自动等比缩放显示
- 无限循环动画

## 实现要点

桌宠的四层结构：

| 文件 | 对应层 |
|------|--------|
| `main.js` | 窗口层：透明/无边框/置顶 + 托盘 |
| `gif-pet.html` + `gif-pet.css` | 角色渲染层：GIF 显示 |
| `gif-pet.js` | 交互层：点击切动作 / 拖拽 / 右键 |
| （可扩展） | AI 能力层：LLM 聊天 / TTS |

关键点：

- 透明窗口三要素：`transparent: true` + `frame: false` + `alwaysOnTop: true`
- 拖拽用 `mousedown`/`mousemove` 算位移量发给主进程移动窗口，而不是 `-webkit-app-region`，这样才能区分「点击」和「拖拽」
- 退出机制必须保留（右键菜单 / 托盘），否则置顶无边框窗口关不掉

## 常见问题

### macOS 提示「未打开 Electron.app，因其包含恶意软件」

Electron 二进制未经过 Apple 签名会触发 Gatekeeper。解决：

1. 升级到较新的 Electron 版本（旧版本（如 31.x）的公证可能已被 Apple 撤销，报 `notarization indicates this code has been revoked`）；
2. 或到「系统设置 → 隐私与安全性 → 仍要打开」手动放行一次。

### 全屏应用后桌宠消失

macOS 全屏应用会独占一个桌面空间。代码里已用 `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })` 让桌宠跨空间显示。

## 许可与版权

本项目的**代码**与**角色素材**采用不同的许可协议，请分别遵守：

### 代码

采用 [MIT License](./LICENSE)，可自由使用、修改、商用。

### 角色素材（`assets/gifs/`）

素材为「一二布布」表情包，作者 **黄小B**，版权归 **北京微次元文化创意有限公司** 所有，采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh)（署名 — 非商业性使用 4.0）许可：

- 允许：个人使用、非商业的复制与分享、非商业二创
- 禁止：商业用途（广告、商品印制、带货盈利）、二次售卖
- 使用须保留署名，且不得用于商业场景

如需商业使用，请联系版权方获取正式授权。
