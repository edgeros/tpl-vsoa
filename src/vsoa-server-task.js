/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : vsoa-server-task.js
* Desc   : Simulate a" vsoa" server program
*/
const vsoa = require('vsoa');
const Tcp = require('tcp');
console.inspectEnable = true;
const VSOA_PORT = 20011

/* 创建 VSOA 服务端实例 */
const server = new vsoa.Server({ info: { name: 'tpl: vsoa server' } });

/* 当客户端连接或断开连接时，将调用此函数 */
server.onclient = function (cli, connect) {
    if (connect) {
        console.log('New client connected!', cli.address().addr);
    } else {
        console.log('Client lost!', cli.address().addr);
    }
}

/* 当服务器接收到DATAGRAM类型的数据包时，调用此回调  */
server.ondata = function (cli, url, payload) {
    console.log(url, JSON.stringify(payload.param));
}

/* VSOA服务器对象继承自EventEmitter, on()方法可用于为不同的服务添加处理回调。 */
server.on('/echo', function (cli, request, payload) {
    cli.reply(0, request.seqno, payload);
});

/* 该功能可以帮助VSOA服务器同步数据，减少数据同步代码。 */
const data = {
    count: 0
}
server.on('/count', function (cli, request, payload) {
    server.syncer(cli, request, payload, data, param => {
        if (typeof param.foo === 'number') {
            data.count = param.count;
            return vsoa.code.SUCCESS;
        } else {
            return vsoa.code.ARGUMENTS;
        }
    });
});


/* 每秒想发布订阅消息*/
setInterval(() => {
    server.publish('/a', { param: { msg: 'Message sent from "/a"' } });
    server.publish('/a/b', { param: { msg: 'Message sent from "/a/b/' } });
    server.publish('/a/b/c', { param: { msg: 'Message sent from "/a/b/c"' } });
}, 1000);




/* 启动 VSOA 服务 */
const saddr = Tcp.sockaddr(Tcp.INADDR_ANY, VSOA_PORT)
server.start(saddr);
Task.send(Task.parent(), {
    type: 'vsoa server',
    port: server.address().port})

/* Event loop */
require('iosched').forever();