const { ipcRenderer } = require('electron');

const electronEmitter = ipcRenderer;

// 绑定electron log
['log', 'info', 'warn', 'error'].forEach((k) => {
    const fn = console[k].bind(console);
    console[k] = (...args) => {
        fn(...args);
        ipcRenderer.send('renderer', k, args);
    };
});

module.exports = electronEmitter;
