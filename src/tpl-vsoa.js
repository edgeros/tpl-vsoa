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
const router = require('./router');
const vsoaCliSer = require('./vsoa-client-service');

console.inspectEnable = true

/* Create App */
const app = WebApp.createApp();

/* Set static path */
app.use(WebApp.static('./public'));

/* Set test rest */
app.use('/api', router);



/* Start VSOA Server  */
const vsoaSerTask = new Task('src/vsoa-server-task.js');
Task.on('message', function (msg, from) {
    if (msg.type === 'vsoa server') {
        vsoaCliSer.vsoaClientInit({port: msg.port})

        /* Start App */
        app.start();
    }
});
