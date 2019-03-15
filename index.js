const { spawn } = require('child_process');
const { join } = require('path');
const { generate } = require('qrcode-terminal');
const electron = require('electron');
const ipc = require('./src/ipc');


const runner = join(__dirname, './src/runner.js');
const proc = spawn(electron, ['--js-flags="--harmony"', runner], {
    stdio: [null, null, null, 'ipc'],
});

const child = ipc(proc);
child.on('runner', (k, args) => {
    console[k](`runner:${k}`, ...args);
});
// child.on('qrcode', (qrcode) => {
//     console.log('qrcode', qrcode);
//     generate(qrcode);
// });

function end() {
    if (proc.connected) proc.disconnect();
    proc.kill();
}

process.on('exit', end);
process.on('SIGINT', end);
process.on('SIGTERM', end);
process.on('SIGQUIT', end);
process.on('SIGHUP', end);
process.on('SIGBREAK', end);
