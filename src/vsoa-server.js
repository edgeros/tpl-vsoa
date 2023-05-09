/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : vsoa-server.js
* Desc   : VSOA server
*/

module.exports.start = start

function start () {
  permission.check({ network: true }, (res) => {
    new Task('src/vsoa-server-task.js')
  })
}
