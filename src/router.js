/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : main.js
* Desc   : webapp router
*/

const WebApp = require('webapp')
const Router = WebApp.Router
const router = Router.create()
const vsoaClient = require('./vsoa-client')

/* 订阅服务接口 */
router.get('/subscribe', function (req, res) {
  vsoaClient.vsoaClientSub()
  res.send('subscribe success!')
})

/* 取消订阅服务接口 */
router.get('/unsubscribe', function (req, res) {
  vsoaClient.vsoaClientUnsub()
  res.send('unsubscribe success!')
})

/* RPC发送信息 */
router.get('/call', function (req, res) {
  vsoaClient.vsoaClientCall().then((time) => {
    res.json(time)
    res.send('call success!')
  })
})

/* Datagram发包形式接口 */
router.get('/datagram', function (req, res) {
  vsoaClient.vsoaClientDatagram()
  res.send('Datgram success!')
})

module.exports = router
