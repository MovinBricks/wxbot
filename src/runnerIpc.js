const parent = require('./ipc')(process);

const parentEmitter = parent;

['log', 'info', 'warn', 'error'].forEach((k) => {
    const fn = console[k].bind(console);
    console[k] = (...args) => {
        fn(...args);
        parent.emit('runner', k, args);
    };
});

module.exports = parentEmitter;
