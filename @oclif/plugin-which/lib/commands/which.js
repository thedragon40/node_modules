"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
class Which extends command_1.Command {
    async run() {
        const { args } = this.parse(Which);
        const cmd = this.config.findCommand(args.command, { must: true });
        cli_ux_1.default.styledHeader(cmd.id);
        cli_ux_1.default.styledObject({
            plugin: cmd.pluginName
        }, ['plugin']);
    }
}
Which.description = 'show which plugin a command is in';
Which.args = [{ name: 'command', required: true }];
exports.default = Which;
