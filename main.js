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

const webapp = require('webapp')
const socketIo = require('socket.io')
const router = require('./src/router')
const vsoaServer = require('./src/vsoa-server')
const vsoaClient = require('./src/vsoa-client')

console.inspectEnable = true

/* Create App */
const app = webapp.createApp()

app.use(webapp.static('./public'))
app.use('/api', router)
app.start()

vsoaServer.start()

/* Init socket.io */
const io = socketIo(app, {
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
})

let vsoaSerInfo = {}

Task.on('message', function (info, from) {
  if (info.type === 'vsoa server') {
    vsoaSerInfo = info
    checkPermission()
  }
})

/* Permission update callback */
permission.update(function () {
  checkPermission()
})

function checkPermission () {
  permission.check({
    network: true
  }, (res) => {
    /* 初始化 vsoa client 实例 */
    if (res) { vsoaClient.vsoaClientInit({ port: vsoaSerInfo.port }, io) }
  })
}

/* Event loop */
require('iosched').forever()
