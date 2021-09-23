"use strict";
// Copyright (C) 2021 Toitware ApS. All rights reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.btoa = exports.atob = exports.toHex = exports.toByteArray = exports.Uint8BufferSlipEncode = exports.Uint8Buffer = exports.sleep = void 0;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
class Uint8Buffer {
    constructor(size = 64) {
        this.readOffset = 0;
        this.writeOffset = 0;
        this.size = size;
        this._buffer = new ArrayBuffer(this.size);
        this._view = new Uint8Array(this._buffer);
    }
    get length() {
        return this.writeOffset - this.readOffset;
    }
    shift() {
        if (this.length <= 0) {
            return undefined;
        }
        return this._view[this.readOffset++];
    }
    grow(newSize) {
        const newBuffer = new ArrayBuffer(newSize);
        const newView = new Uint8Array(newBuffer);
        this._view.forEach((v, i) => (newView[i] = v));
        this.size = newSize;
        this._buffer = newBuffer;
        this._view = newView;
    }
    fill(element, length = 1) {
        this.ensure(length);
        this._view.fill(element, this.writeOffset, this.writeOffset + length);
        this.writeOffset += length;
    }
    ensure(length) {
        if (this.size - this.writeOffset < length) {
            const newSize = this.size + Math.max(length, this.size);
            this.grow(newSize);
        }
    }
    pushBytes(value, byteCount, littleEndian) {
        for (let i = 0; i < byteCount; i++) {
            if (littleEndian) {
                this.push((value >> (i * 8)) & 0xff);
            }
            else {
                this.push((value >> ((byteCount - i) * 8)) & 0xff);
            }
        }
    }
    pack(format, ...args) {
        let pointer = 0;
        const data = args;
        if (format.replace(/[<>]/, "").length != data.length) {
            throw "Pack format to Argument count mismatch";
        }
        let littleEndian = true;
        for (let i = 0; i < format.length; i++) {
            if (format[i] == "<") {
                littleEndian = true;
            }
            else if (format[i] == ">") {
                littleEndian = false;
            }
            else if (format[i] == "B") {
                this.pushBytes(data[pointer], 1, littleEndian);
                pointer++;
            }
            else if (format[i] == "H") {
                this.pushBytes(data[pointer], 2, littleEndian);
                pointer++;
            }
            else if (format[i] == "I") {
                this.pushBytes(data[pointer], 4, littleEndian);
                pointer++;
            }
            else {
                throw "Unhandled character in pack format";
            }
        }
    }
    reset() {
        this.writeOffset = 0;
        this.readOffset = 0;
    }
    push(...bytes) {
        this.ensure(bytes.length);
        this._view.set(bytes, this.writeOffset);
        this.writeOffset += bytes.length;
    }
    copy(bytes) {
        this.ensure(bytes.length);
        this._view.set(bytes, this.writeOffset);
        this.writeOffset += bytes.length;
    }
    view() {
        return new Uint8Array(this._buffer, this.readOffset, this.writeOffset);
    }
}
exports.Uint8Buffer = Uint8Buffer;
/**
 * @name Uint8BufferSlipEncode
 * makes a Uint8Buffer with slipEncoding mechanisms.
 * When slipEncode is enabled it:
 *  * replaces 0xdb with 0xdb 0xdd
 *  * and 0xc0 with 0xdb 0xdc
 * for all write operations.
 */
class Uint8BufferSlipEncode extends Uint8Buffer {
    constructor() {
        super(...arguments);
        this.slipEncode = false;
    }
    push(...bytes) {
        if (!this.slipEncode) {
            super.push(...bytes);
        }
        else {
            bytes.forEach((v) => this.slipEncodeByte(v));
        }
    }
    reset() {
        this.slipEncode = false;
        super.reset();
    }
    copy(bytes) {
        if (!this.slipEncode) {
            super.copy(bytes);
        }
        else {
            bytes.forEach((v) => this.slipEncodeByte(v));
        }
    }
    /**
     * @name slipEncodeByte
     * Replaces 0xdb with 0xdb 0xdd and 0xc0 with 0xdb 0xdc
     */
    slipEncodeByte(v) {
        if (v == 0xdb) {
            super.push(0xdb, 0xdd);
        }
        else if (v == 0xc0) {
            super.push(0xdb, 0xdc);
        }
        else {
            super.push(v);
        }
    }
}
exports.Uint8BufferSlipEncode = Uint8BufferSlipEncode;
function toByteArray(str) {
    const byteArray = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        byteArray[i] = charcode & 0xff;
    }
    return byteArray;
}
exports.toByteArray = toByteArray;
function toHex(value, size = 2) {
    return "0x" + value.toString(16).toUpperCase().padStart(size, "0");
}
exports.toHex = toHex;
function atob(ascii) {
    if (typeof window !== "undefined" && window.atob) {
        return window.atob(ascii);
    }
    else if (typeof Buffer !== "undefined") {
        const buf = Buffer.from(ascii, "ascii");
        const base64 = buf.toString("base64");
        return base64;
    }
    throw new Error("unsupported environment");
}
exports.atob = atob;
function btoa(base64) {
    if (typeof window !== "undefined" && window.atob) {
        return window.btoa(base64);
    }
    else if (typeof Buffer !== "undefined") {
        const buf = Buffer.from(base64, "base64");
        const ascii = buf.toString("ascii");
        return ascii;
    }
    throw new Error("unsupported environment");
}
exports.btoa = btoa;
//# sourceMappingURL=util.js.map