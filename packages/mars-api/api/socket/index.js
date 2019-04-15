/**
 * @file Socket API
 * @author: zhaolongfei
 */

import {callback} from '../../lib/utils';

class SocketTask {
    constructor(socket) {
        this.socketTaskId = Date.now();
        this.socket = socket;
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
    }

    get readyState() {
        return this.socket.readyState;
    }

    send(options) {
        const {
            data,
            success,
            fail,
            complete
        } = options;

        let err = null;
        try {
            this.socket.send(data);
        } catch (e) {
            err = e;
        }

        if (err) {
            callback(fail, err);
            callback(complete, err);
            return Promise.reject(err);
        } else {
            callback(success);
            callback(complete);
            return Promise.resolve();
        }
    }

    close(options) {
        const {
            code,
            reason = '',
            success,
            fail,
            complete
        } = options;

        let err = null;
        try {
            this.socket.close(code, reason);
        } catch (e) {
            err = e;
        }

        if (err) {
            callback(fail, err);
            callback(complete, err);
            return Promise.reject(err);
        } else {
            callback(success);
            callback(complete);
            return Promise.resolve();
        }
    }

    onOpen(cb) {
        this.socket.onopen = cb;
    }

    onClose(cb) {
        this.socket.onclose = cb;
    }

    onError(cb) {
        this.socket.onerror = cb;
    }

    onMessage(cb) {
        this.socket.onmessage = cb;
    }
}

/* global MarsSocket */
const MarsSocket = [];

export function connectSocket(options) {
    const {
        url,
        header,
        protocols = [],
        success,
        fail,
        complete
    } = options || {};

    return new Promise((resolve, reject) => {
        let err = null;
        let socketTask = null;

        try {
            const websocket = new WebSocket(url, protocols);
            socketTask = new SocketTask(websocket);
            MarsSocket.push(websocket);
        } catch (e) {
            err = e;
        }

        if (!err) {
            callback(success, socketTask);
            callback(complete, socketTask);
            resolve(socketTask);
        } else {
            callback(fail, err);
            callback(complete, err);
            reject(err);
        }
    });
}

export function onSocketOpen(cb) {
    // MarsSocket[0].addEventListener('open', event => cb(event) });
    MarsSocket[0].onopen = cb;
}

export function onSocketError(cb) {
    // MarsSocket[0].addEventListener('error', event => cb(event) });
    MarsSocket[0].onerror = cb;
}

export function sendSocketMessage(options) {
    const {
        data,
        success,
        fail,
        complete
    } = options || {};

    let err = null;

    try {
        MarsSocket[0].send(data);
    } catch (e) {
        err = e;
    }

    if (err) {
        callback(fail, err);
        callback(complete, err);
        return Promise.reject(err);
    } else {
        callback(success);
        callback(complete);
        return Promise.resolve();
    }
}

export function onSocketMessage(cb) {
    MarsSocket[0].onmessage = cb;
}

export function closeSocket(options) {
    const {
        code,
        reason = '',
        success,
        fail,
        complete
    } = options || {};

    let err = null;
    try {
        MarsSocket[0].close(code, reason);
    } catch (e) {
        err = e;
    }

    if (err) {
        callback(fail, err);
        callback(complete, err);
        return Promise.reject(err);
    } else {
        callback(success);
        callback(complete);
        return Promise.resolve();
    }
}

export function onSocketClose(cb) {
    MarsSocket[0].onclose = cb;
}
