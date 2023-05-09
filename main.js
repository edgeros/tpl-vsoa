/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : main.js
* Desc   : application entrypoint
*/

require('./src/vsoa-server')

const webapp = require('webapp');
const socketIo = require('socket.io')
const router = require('./router');
const vsoaServer = require('./src/vsoa-server');
const vsoaClient = require('./src/vsoa-client');

console.inspectEnable = true;

/* Create App */
const app = webapp.createApp();

app.use(webapp.static('./public'));
app.use('/api', router);
app.start();

vsoaServer.start();

/* Init socket.io */
const io = socketIo(app, { 
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

/* Permission update callback */
permission.update(function () {
  permission.check({ network: true }, (res)=>{
    if(res) vsoaClient.vsoaClientInit({ port: vsoaSerInfo.port }, io);
  });
});

/* Event loop */
require('iosched').forever();
