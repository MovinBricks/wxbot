const {
    app, session, ipcMain, BrowserWindow,
} = require('electron');
const { join } = require('path');
const fs = require('fs');
const mime = require('mime');

const downloadDir = join(__dirname, '../download');
try {
    fs.mkdirSync(downloadDir);
} catch (err) {
    // ignore
}

let win;

// 将renderer的输出 转发到terminal
ipcMain.on('renderer', (e, k, args) => {
    console[k]('renderer', k, args);
});

app.on('activate', () => {
    if (win) win.show();
});

app.on('ready', () => {
    const show = true; // 是否显示浏览器窗口
    const preload = join(__dirname, '../electron/preload.js');

    win = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: false,
        },
        width: 900,
        height: 610,
        show,
    });

    // Ctrl+C只会发送win.close 并且如果已登录  窗口还关不掉
    // 所以干脆改为窗口关闭 直接退出
    // https://github.com/electron/electron/issues/5273
    win.on('close', (e) => {
        e.preventDefault();
        win.destroy();
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    win.loadURL('https://wx.qq.com');

    const sess = session.defaultSession;
    sess.on('will-download', async (e, item) => {

        // 下载消息中的多媒体文件 图片/语音
        const mimeType = item.getMimeType();
        let filename = item.getFilename();
        let ext = mime.extension(mimeType);

        // 修复mime缺少映射关系: `audio/mp3` => `mp3`
        if (mimeType === 'audio/mp3') ext = 'mp3';
        if (ext === 'bin') ext = '';
        if (ext) filename += `.${ext}`;

        const date = new Date().toJSON();
        filename = `${date}_${filename}`;

        // 跨平台文件名容错
        // http://blog.fritx.me/?weekly/160227
        filename = filename.replace(/[\\\/:\*\,"\?<>|]/g, '_');

        const dest = join(downloadDir, filename);
        await saveItem(item, dest, `文件保存 ${filename}`);
    });
});

async function saveItem(item, dest, log) {
    item.setSavePath(dest);
    return await new Promise((rs) => {
        item.on('done', (e, state) => {
            console.log(`${log} state:${state}`);
            rs(state);
        });
    });
}
