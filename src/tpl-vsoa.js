/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : main.js
* Desc   : vsoa eap main file
*/

/* Import system modules */
const WebApp = require('webapp');
const socketIo = require('socket.io')
const router = require('./router');
const vsoaCliSer = require('./vsoa-client-service');


console.inspectEnable = true

/* Create App */
const app = WebApp.createApp();

/* Set static path */
app.use(WebApp.static('./public'));

/* Set test rest */
app.use('/api', router);


const io = socketIo(app, { 
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

/* 当vsoa server 启动后启动 EAP后台  */
new Task('src/vsoa-server-task.js');
Task.on('message', function (msg, from) {
    if (msg.type === 'vsoa server') {
        /* 初始化 vsoa client 实例 */
        vsoaCliSer.vsoaClientInit({ port: msg.port },io)
        /* Start App */
        app.start();
    }
});



