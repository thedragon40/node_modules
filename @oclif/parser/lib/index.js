"use strict";
// tslint:disable interface-over-type-literal
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const args = tslib_1.__importStar(require("./args"));
exports.args = args;
const deps_1 = tslib_1.__importDefault(require("./deps"));
const flags = tslib_1.__importStar(require("./flags"));
exports.flags = flags;
const parse_1 = require("./parse");
var help_1 = require("./help");
exports.flagUsages = help_1.flagUsages;
// eslint-disable-next-line new-cap
const m = deps_1.default()
    // eslint-disable-next-line node/no-missing-require
    .add('validate', () => require('./validate').validate);
function parse(argv, options) {
    const input = {
        argv,
        context: options.context,
        args: (options.args || []).map((a) => args.newArg(a)),
        '--': options['--'],
        flags: Object.assign({ color: flags.defaultFlags.color }, ((options.flags || {}))),
        strict: options.strict !== false,
    };
    const parser = new parse_1.Parser(input);
    const output = parser.parse();
    m.validate({ input, output });
    return output;
}
exports.parse = parse;
