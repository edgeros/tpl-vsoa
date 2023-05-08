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

/* Set IO instance */
const io = socketIo(app, { 
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

/* 当vsoa server 启动后启动 EAP后台  */
let vsoaSerInfo={}
new Task('src/vsoa-server-task.js');
Task.on('message', function (info, from) {
    if (info.type === 'vsoa server') {
        vsoaSerInfo=info
        app.start();
        checkPermission()
    }
});

/* 判断权限 */
function checkPermission(){
    permission.check({
        network:true
    },(res)=>{
        /* 初始化 vsoa client 实例 */
        if(res) vsoaCliSer.vsoaClientInit({ port: vsoaSerInfo.port },io)
    })
}

/* 当前应用的权限修改时调用 */
permission.update(function(perm){
    checkPermission()
})



