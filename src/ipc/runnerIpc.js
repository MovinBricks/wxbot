const parent = require('./index')(process);

module.exports = function () {
    // childProcess log绑定process log
    ['log', 'info', 'warn', 'error'].forEach(k => {
        const fn = console[k].bind(console);
        console[k] = (...args) => {
            fn(...args);
            parent.emit('runner', k, args);
        };
    });
}
