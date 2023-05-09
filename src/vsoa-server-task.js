/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : vsoa-server-task.js
* Desc   : Simulate a "vsoa" server program
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

/* VSOA服务器对象继承自EventEmitter, on()方法可用于为不同的服务添加处理回调。*/
server.on('/time', function (cli, request, payload) {
    /* 定义一个格式化输出日期的函数 */
    function timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    }
    const time = new Date().getTime();
    const date = timestampToTime(time); //生成一个格式化的日期
    const content = {}
    content.param = { 'today': date }
    cli.reply(0, request.seqno, content)
})


/* 修改num的值 */
let num = 0;
server.ondata = function (cli, url, payload) {
    console.log(`[tpl vsoa] vsoa server receive message form :${url}`, `messgae:`, JSON.stringify(payload.param));
    num = payload.param
}

/* 重置num的值 */
server.on('/resetting', function (cli, request, payload) {
    num = 0
})

/* 每秒想发布订阅消息 */
setInterval(() => {
    server.publish('/a', { param: { msg: num } });
    server.publish('/a/b', { param: { msg: num } });
    server.publish('/a/b/c', { param: { msg: num } });
    num++
}, 1000);

/* 启动 VSOA 服务 */
const saddr = Tcp.sockaddr(Tcp.INADDR_ANY, VSOA_PORT)
server.start(saddr);
Task.send(Task.parent(), {
    type: 'vsoa server',
    port: server.address().port
})

/* Event loop */
require('iosched').forever();