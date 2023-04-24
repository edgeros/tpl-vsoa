/*
 * Copyright (c) 2020 EdgerOS Team.
 * All rights reserved.
 *
 * Detailed license information can be found in the LICENSE file.
 *
 * File: demo rest api.
 *
 * Author: Li.Ping <liping@acoinfo.com>
 *
 */
const WebApp = require('webapp');
const Router = WebApp.Router;
const router = Router.create();
const vsoaCliSer = require('./vsoa-client-service');

/**
 * 订阅服务接口
 */
router.get('/subscribe', function (req, res) {
	vsoaCliSer.vsoaClientSub();
	res.send('subscribe success!')
});

/**
 * 取消订阅服务接口
 */
router.get('/unsubscribe', function (req, res) {
	vsoaCliSer.vsoaClientUnsub();
	res.send('unsubscribe success!');
});

/**
 * RPC发送信息
 */
router.get('/call', function (req, res) {
	vsoaCliSer.vsoaClientCall().then((time)=>{
		res.json(time)
		res.send('call success!');
	});
})

/**  
 * RPC异步模式接口
 */
router.get('/fetch', function (req, res) {
	vsoaCliSer.vsoaClientFetch().then((data)=>{
		res.json(data.payload)
		res.send('fetch success!');
	})
});

/**
 * Datagram发包形式接口
 */
router.get('/datagram', function (req, res) {
	vsoaCliSer.vsoaClientDatagram()
	res.send('Datgram success!');
});

module.exports = router
