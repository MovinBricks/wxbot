const { join } = require('path');
const { download } = require('../util');

module.exports = replyMsg;

const handlers = {
    text({ text }) {
        return { text };
    },

    picture({ src }) {
        saveMedia(src);

        const largeSrc = src.replace('&type=slave', '');
        saveMedia(largeSrc, 'large'); // 大图
        return {
            image: join(__dirname, '../fuck.jpeg'),
        };
    },

    emoticon() { // 用户自定义表情
        return { text: '发毛表情' };
    },

    sticker() { // 微信内部表情
        return { text: '发毛表情' };
    },

    voice({ src }) {
        saveMedia(src);
        return { text: '发毛语音' };
    },

    video() {
        return { text: '发毛视频' };
    },

    microvideo() {
        return { text: '发毛小视频' };
    },

    location({ src, desc }) {
        saveMedia(src);
        return { text: desc };
    },

    attach({ src, title, size }) {
        saveMedia(src);
        return {
            text: `${title}\n${size}`,
        };
    },

    app({ title, url }) {
        return {
            text: `${title}\n${url}`,
        };
    },

    card({ name, wxid }) {
        return { text: name };
    },

    transfer() {
        return { text: '转毛帐' };
    },

    'video/voice call': function () {
        return { text: '聊jj' };
    },

    // 似乎功能已经不支持
    // 'real-time voice' () {
    //   return { text: '对讲你妹' }
    // },

    /* 以下为无法自动感应病回应的消息 */
    'red packet': function () {
        return { text: '发毛红包' };
    },

    recall({ by }) {
    // return { text: `${by} 撤回了消息` }
        return { text: '撤jj' };
    },

    'new member': function ({ who, by }) {
    // return { text: `${by} 邀请了 ${who}` }
        return { text: '加毛人' };
    },

    'member is stranger': function ({ who }) {
        return { text: `大家要小心 ${who}` };
    },

    'real-time location ended': function () {
        return { text: '位置共享已经结束' };
    },

    // 似乎功能已经不支持
    // 'real-time voice ended' () {
    //   return { text: '实时对讲已经结束' }
    // },

    removed() {
        return null;
    },

    'not recognized': function () {
        return null; // 忽略消息 不回应
    },
    /* 以上为无法自动感应病回应的消息 */

    'not supported': function () {
        return { text: '不懂' };
    },
};

// fixme: attach文件附带content-deposition 覆盖download属性设置的filename
// https://stackoverflow.com/questions/23872902/chrome-download-attribute-not-working
function saveMedia(src, suffix) {
    const mat = src.match(/msgid=(\d+)/i);
    const msgid = mat && mat[1];
    let filename = msgid || '';
    if (suffix) filename += `_${suffix}`;
    download(src, filename);
}

async function replyMsg(msg) {
    const handler = handlers[msg.type]
    || handlers['not recognized'];

    const reply = await toPromise(
        handler(msg),
    );
    return reply;
}

function toPromise(ret) {
    if (ret && ret.then) return ret;
    return Promise.resolve(ret);
}
