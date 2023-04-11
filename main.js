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

/* Create App */
const app = WebApp.createApp();

/* Set static path */
app.use(WebApp.static('./public'));

/* Set test rest */
app.use('/api', require('./routers'));


/* Start App */
app.start();

/* Event loop */
require('iosched').forever();
