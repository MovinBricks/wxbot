async function delay(duration) {
    return new Promise((rs) => {
        setTimeout(() => rs(), duration);
    });
}

function download(href, filename = '') {
    console.log('触发下载', filename, href);
    const a = document.createElement('a');
    a.download = filename;
    a.href = href;
    a.click();
}

function s(selector) {
    return document.querySelector(selector);
}
function sa(selector) {
    return document.querySelectorAll(selector);
}

module.exports = {
    s,
    sa,
    download,
    delay,
};
