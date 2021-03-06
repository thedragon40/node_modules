"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const indent = require("indent-string");
const stripAnsi = require("strip-ansi");
const list_1 = require("./list");
const util_1 = require("./util");
const { underline, bold, } = chalk;
let { dim, } = chalk;
if (process.env.ConEmuANSI === 'ON') {
    dim = chalk.gray;
}
const wrap = require('wrap-ansi');
class CommandHelp {
    constructor(command, config, opts) {
        this.command = command;
        this.config = config;
        this.opts = opts;
        this.render = util_1.template(this);
    }
    generate() {
        const cmd = this.command;
        const flags = util_1.sortBy(Object.entries(cmd.flags || {})
            .filter(([, v]) => !v.hidden)
            .map(([k, v]) => {
            v.name = k;
            return v;
        }), f => [!f.char, f.char, f.name]);
        const args = (cmd.args || []).filter(a => !a.hidden);
        let output = util_1.compact([
            this.usage(flags),
            this.args(args),
            this.flags(flags),
            this.description(),
            this.aliases(cmd.aliases),
            this.examples(cmd.examples || cmd.example),
        ]).join('\n\n');
        if (this.opts.stripAnsi)
            output = stripAnsi(output);
        return output;
    }
    usage(flags) {
        const usage = this.command.usage;
        const body = (usage ? util_1.castArray(usage) : [this.defaultUsage(flags)])
            .map(u => `$ ${this.config.bin} ${u}`.trim())
            .join('\n');
        return [
            bold('USAGE'),
            indent(wrap(this.render(body), this.opts.maxWidth - 2, { trim: false, hard: true }), 2),
        ].join('\n');
    }
    defaultUsage(_) {
        return util_1.compact([
            this.command.id,
            this.command.args.filter(a => !a.hidden).map(a => this.arg(a)).join(' '),
        ]).join(' ');
    }
    description() {
        const cmd = this.command;
        const description = cmd.description && this.render(cmd.description).split('\n').slice(1).join('\n');
        if (!description)
            return;
        return [
            bold('DESCRIPTION'),
            indent(wrap(description.trim(), this.opts.maxWidth - 2, { trim: false, hard: true }), 2),
        ].join('\n');
    }
    aliases(aliases) {
        if (!aliases || aliases.length === 0)
            return;
        const body = aliases.map(a => ['$', this.config.bin, a].join(' ')).join('\n');
        return [
            bold('ALIASES'),
            indent(wrap(body, this.opts.maxWidth - 2, { trim: false, hard: true }), 2),
        ].join('\n');
    }
    examples(examples) {
        if (!examples || examples.length === 0)
            return;
        const body = util_1.castArray(examples).map(a => this.render(a)).join('\n');
        return [
            bold('EXAMPLE' + (examples.length > 1 ? 'S' : '')),
            indent(wrap(body, this.opts.maxWidth - 2, { trim: false, hard: true }), 2),
        ].join('\n');
    }
    args(args) {
        if (args.filter(a => a.description).length === 0)
            return;
        const body = list_1.renderList(args.map(a => {
            var _a;
            const name = a.name.toUpperCase();
            let description = a.description || '';
            // `a.default` is actually not always a string (typing bug), hence `toString()`
            if (a.default || ((_a = a.default) === null || _a === void 0 ? void 0 : _a.toString()) === '0')
                description = `[default: ${a.default}] ${description}`;
            if (a.options)
                description = `(${a.options.join('|')}) ${description}`;
            return [name, description ? dim(description) : undefined];
        }), { stripAnsi: this.opts.stripAnsi, maxWidth: this.opts.maxWidth - 2 });
        return [
            bold('ARGUMENTS'),
            indent(body, 2),
        ].join('\n');
    }
    arg(arg) {
        const name = arg.name.toUpperCase();
        if (arg.required)
            return `${name}`;
        return `[${name}]`;
    }
    flags(flags) {
        if (flags.length === 0)
            return;
        const body = list_1.renderList(flags.map(flag => {
            var _a;
            let left = flag.helpLabel;
            if (!left) {
                const label = [];
                if (flag.char)
                    label.push(`-${flag.char[0]}`);
                if (flag.name) {
                    if (flag.type === 'boolean' && flag.allowNo) {
                        label.push(`--[no-]${flag.name.trim()}`);
                    }
                    else {
                        label.push(`--${flag.name.trim()}`);
                    }
                }
                left = label.join(', ');
            }
            if (flag.type === 'option') {
                let value = flag.helpValue || flag.name;
                if (!flag.helpValue && flag.options) {
                    value = flag.options.join('|');
                }
                if (!value.includes('|'))
                    value = underline(value);
                left += `=${value}`;
            }
            let right = flag.description || '';
            // `flag.default` is not always a string (typing bug), hence `toString()`
            if (flag.type === 'option' && (flag.default || ((_a = flag.default) === null || _a === void 0 ? void 0 : _a.toString()) === '0')) {
                right = `[default: ${flag.default}] ${right}`;
            }
            if (flag.required)
                right = `(required) ${right}`;
            return [left, dim(right.trim())];
        }), { stripAnsi: this.opts.stripAnsi, maxWidth: this.opts.maxWidth - 2 });
        return [
            bold('OPTIONS'),
            indent(body, 2),
        ].join('\n');
    }
}
exports.default = CommandHelp;
