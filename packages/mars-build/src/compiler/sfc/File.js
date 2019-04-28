/**
 * @file gulp plugin
 * @author zhangwentao <winty2013@gmail.com>
 */

/* eslint-disable fecs-no-require */

/* eslint-disable no-native-reassign */

/* eslint-disable fecs-min-vars-per-destructure */

const Vinyl = require('vinyl');
const fs = require('fs-extra');

Vinyl.prototype.writeFileSync = function () {
    if (!this.contents || !this.path) {
        throw new Error('Vinyl.prototype.writeFileSync() requires path and contents to write');
    }

    fs.outputFileSync(this.path, this.contents.toString());
};

Vinyl.prototype.appendContent = function (str) {
    const content = this.contents ? this.contents.toString() : '';
    this.contents = Buffer.from(content + str);
};

module.exports = Vinyl;
