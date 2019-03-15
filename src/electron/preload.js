require('../ipc/preloadIpc');

const { clipboard, nativeImage } = require('electron');

// 禁用微信网页绑定的beforeunload
// 导致页面无法正常刷新和关闭
window.__defineSetter__('onbeforeunload', () => {
    // noop
});

document.addEventListener('DOMContentLoaded', () => {
    // 禁止外层网页滚动 影响使用
    document.body.style.overflow = 'hidden';
    detectPage();
});
