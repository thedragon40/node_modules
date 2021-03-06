"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const semver = tslib_1.__importStar(require("semver"));
const version = semver.parse(require('../package.json').version);
const g = global;
const globals = g['cli-ux'] || (g['cli-ux'] = {});
const actionType = (!!process.stdin.isTTY &&
    !!process.stderr.isTTY &&
    !process.env.CI &&
    !['dumb', 'emacs-color'].includes(process.env.TERM) &&
    'spinner') || 'simple';
const Action = actionType === 'spinner' ? require('./action/spinner').default : require('./action/simple').default;
class Config {
    constructor() {
        this.outputLevel = 'info';
        this.action = new Action();
        this.errorsHandled = false;
        this.showStackTrace = true;
    }
    get debug() { return globals.debug || process.env.DEBUG === '*'; }
    set debug(v) { globals.debug = v; }
    get context() { return globals.context || {}; }
    set context(v) { globals.context = v; }
}
exports.Config = Config;
function fetch() {
    if (globals[version.major])
        return globals[version.major];
    return globals[version.major] = new Config();
}
exports.config = fetch();
exports.default = exports.config;
