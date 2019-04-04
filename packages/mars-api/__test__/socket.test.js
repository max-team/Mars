/**
 * @file websocket api unit test
 * @author zhaolognfei <izhaolongfei@gmail.com>
 */

import * as SocketApi from '../api/socket/index';
import {
    WebSocket,
    Server
} from 'mock-socket';

window.WebSocket = WebSocket;

/* eslint-disable */
describe('[api]websocket', () => {
    test('param error', () => {
        const fail = jest.fn();
        const complete = jest.fn();
        // SocketApi.connectSocket()
        // SocketApi.connectSocket('')
        // SocketApi.connectSocket({})
        return SocketApi.connectSocket({
                url: 'xxx',
                fail,
                complete
            })
            .catch(err => {
                expect.any(Error);
                expect(fail).toHaveBeenCalled();
                expect(complete.mock.calls.length).toBe(1);
            });
    });

    test('global api process', done => {
        const mockServer = new Server('wss://localhost:8080');
        const msg = 'hello jack';
        const msg2 = 'hello rose';
        const closeCode = 1000;
        const closeReason = 'game over';

        mockServer.on('connection', socket => {
            // console.log('socket connection ok...');
            socket.on('message', message => {
                // console.log('on message>>>', msg);
                expect(message).toMatch(msg);
                socket.send(msg2);
            });
        });

        const success = jest.fn();
        const complete = jest.fn();
        SocketApi.connectSocket({
            url: 'wss://localhost:8080',
            success,
            complete
        }).then(task => {
            expect(success).toHaveBeenCalled();

            // test global api
            const opened = jest.fn(e => {
                expect(e).toBeTruthy();

                // send message
                SocketApi.sendSocketMessage({
                    data: msg
                });
            });
            SocketApi.onSocketOpen(opened);
            setTimeout(_ => {
                expect(opened).toBeCalledWith(expect.anything());
            }, 10);

            SocketApi.onSocketMessage(res => {
                // console.log('receive message>>>', res.data);
                expect(res.data).toMatch(msg2);

                // console.log('goto close socket');
                const efail = jest.fn();
                SocketApi.closeSocket({
                    code: closeCode,
                    reason: closeReason,
                    fail: efail
                }).catch(err => {
                    expect(efail).toHaveBeenCalled();
                });
            });

            SocketApi.onSocketClose(res => {
                // console.log('socket closed');
                done();
            });
        });
    });

    test('socket task process', done => {
        const mockServer = new Server('wss://localhost:8081');
        const msg = 'hello jack2';
        const msg2 = 'hello rose2';
        const closeCode = 1000;
        const closeReason = 'game over2';

        mockServer.on('connection', socket => {
            // console.log('socket2 connection ok...');
            socket.on('message', message => {
                // console.log('on message2>>>', msg);
                expect(message).toMatch(msg);
                socket.send(msg2);
            });
        });

        const success = jest.fn();
        const complete = jest.fn();
        SocketApi.connectSocket({
            url: 'wss://localhost:8081',
            success,
            complete
        }).then(task => {
            jest.spyOn(task.socket, 'send');
            jest.spyOn(task.socket, 'close');

            task.onOpen(_ => {
                task.send({
                    data: msg
                }).then(res => {
                    expect(task.socket.send).toHaveBeenCalled();
                });
            });
            task.onMessage(res => {
                // console.log('receive message2>>>', res.data);
                expect(res.data).toMatch(msg2);

                // console.log('goto close socket2');
                task.close({
                    code: closeCode,
                    reason: closeReason
                }).then(res => {
                    expect(task.socket.close).toHaveBeenCalled();
                });
            });
            task.onClose(({
                code,
                reason
            }) => {
                expect(success.mock.calls.length).toBe(1);
                expect(code).toBe(closeCode);
                expect(reason).toBe(closeReason);
                // console.log('socket2 closed');
                done();
            });
        });
    });
});
