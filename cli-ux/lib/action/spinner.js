"use strict";
// tslint:disable restrict-plus-operands
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const supportsColor = tslib_1.__importStar(require("supports-color"));
const deps_1 = tslib_1.__importDefault(require("../deps"));
const base_1 = require("./base");
const spinners = require('./spinners');
function color(s) {
    if (!supportsColor)
        return s;
    let has256 = supportsColor.stdout.has256 || (process.env.TERM || '').indexOf('256') !== -1;
    return has256 ? `\u001b[38;5;104m${s}${deps_1.default.ansiStyles.reset.open}` : chalk_1.default.magenta(s);
}
class SpinnerAction extends base_1.ActionBase {
    constructor() {
        super();
        this.type = 'spinner';
        this.frames = spinners[process.platform === 'win32' ? 'line' : 'dots2'].frames;
        this.frameIndex = 0;
    }
    _start() {
        this._reset();
        if (this.spinner)
            clearInterval(this.spinner);
        this._render();
        let interval = (this.spinner = setInterval(this._render.bind(this), process.platform === 'win32' ? 500 : 100, 'spinner'));
        interval.unref();
    }
    _stop(status) {
        if (this.task)
            this.task.status = status;
        if (this.spinner)
            clearInterval(this.spinner);
        this._render();
        this.output = undefined;
    }
    _pause(icon) {
        if (this.spinner)
            clearInterval(this.spinner);
        this._reset();
        if (icon)
            this._render(` ${icon}`);
        this.output = undefined;
    }
    _render(icon) {
        const task = this.task;
        if (!task)
            return;
        this._reset();
        this._flushStdout();
        let frame = icon === 'spinner' ? ` ${this._frame()}` : icon || '';
        let status = task.status ? ` ${task.status}` : '';
        this.output = `${task.action}...${frame}${status}\n`;
        this._write(this.std, this.output);
    }
    _reset() {
        if (!this.output)
            return;
        let lines = this._lines(this.output);
        this._write(this.std, deps_1.default.ansiEscapes.cursorLeft + deps_1.default.ansiEscapes.cursorUp(lines) + deps_1.default.ansiEscapes.eraseDown);
        this.output = undefined;
    }
    _frame() {
        let frame = this.frames[this.frameIndex];
        this.frameIndex = ++this.frameIndex % this.frames.length;
        return color(frame);
    }
    _lines(s) {
        return deps_1.default
            .stripAnsi(s)
            .split('\n')
            .map(l => Math.ceil(l.length / deps_1.default.screen.errtermwidth))
            .reduce((c, i) => c + i, 0);
    }
}
exports.default = SpinnerAction;
