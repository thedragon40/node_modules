"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
async function touch(p) {
    try {
        await fs.utimes(p, new Date(), new Date());
    }
    catch (_a) {
        await fs.outputFile(p, '');
    }
}
exports.touch = touch;
async function ls(dir) {
    let files = await fs.readdir(dir);
    let paths = files.map(f => path.join(dir, f));
    return Promise.all(paths.map(path => fs.stat(path).then(stat => ({ path, stat }))));
}
exports.ls = ls;
function wait(ms, unref = false) {
    return new Promise(resolve => {
        let t = setTimeout(() => resolve(), ms);
        if (unref)
            t.unref();
    });
}
exports.wait = wait;
