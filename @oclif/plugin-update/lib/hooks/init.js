"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_ux_1 = require("cli-ux");
const spawn = require("cross-spawn");
const fs = require("fs-extra");
const path = require("path");
const util_1 = require("../util");
const debug = require('debug')('cli:updater');
function timestamp(msg) {
    return `[${new Date().toISOString()}] ${msg}`;
}
async function mtime(f) {
    const { mtime } = await fs.stat(f);
    return mtime;
}
exports.init = async function (opts) {
    if (opts.id === 'update')
        return;
    if (opts.config.scopedEnvVarTrue('DISABLE_AUTOUPDATE'))
        return;
    const binPath = this.config.binPath || this.config.bin;
    const lastrunfile = path.join(this.config.cacheDir, 'lastrun');
    const autoupdatefile = path.join(this.config.cacheDir, 'autoupdate');
    const autoupdatelogfile = path.join(this.config.cacheDir, 'autoupdate.log');
    const clientRoot = this.config.scopedEnvVar('OCLIF_CLIENT_HOME') || path.join(this.config.dataDir, 'client');
    const autoupdateEnv = Object.assign({}, process.env, { [this.config.scopedEnvVarKey('TIMESTAMPS')]: '1', [this.config.scopedEnvVarKey('SKIP_ANALYTICS')]: '1' });
    async function autoupdateNeeded() {
        try {
            const m = await mtime(autoupdatefile);
            let days = 1;
            if (opts.config.channel === 'stable')
                days = 14;
            m.setHours(m.getHours() + days * 24);
            return m < new Date();
        }
        catch (err) {
            if (err.code !== 'ENOENT')
                cli_ux_1.default.error(err.stack);
            if (global.testing)
                return false;
            debug('autoupdate ENOENT');
            return true;
        }
    }
    await util_1.touch(lastrunfile);
    const clientDir = path.join(clientRoot, this.config.version);
    if (await fs.pathExists(clientDir))
        await util_1.touch(clientDir);
    if (!await autoupdateNeeded())
        return;
    debug('autoupdate running');
    await fs.outputFile(autoupdatefile, '');
    debug(`spawning autoupdate on ${binPath}`);
    let fd = await fs.open(autoupdatelogfile, 'a');
    // @ts-ignore
    fs.write(fd, timestamp(`starting \`${binPath} update --autoupdate\` from ${process.argv.slice(1, 3).join(' ')}\n`));
    spawn(binPath, ['update', '--autoupdate'], {
        detached: !this.config.windows,
        stdio: ['ignore', fd, fd],
        env: autoupdateEnv,
    })
        .on('error', (e) => process.emitWarning(e))
        .unref();
};
