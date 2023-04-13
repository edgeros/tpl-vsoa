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
 * 
 */
router.get('/subscribe', function (req, res) {
	vsoaCliSer.vsoaClientSub();
	res.send('subscribe success!')
});


/**
 * 
 */
router.get('/unsubscribe', function (req, res) {
	vsoaCliSer.vsoaClientUnsub();
	res.send('unsubscribe success!');
});

/**
 * 
 */
router.get('/call', function (req, res) {
	vsoaCliSer.vsoaClientCall();
	res.send('call success!');
});


/**
 * 
 */
router.get('/fetch', function (req, res) {
	vsoaCliSer.vsoaClientFetch();
	res.send('Fetch success!');
});



/**
 * 
 */
router.get('/datagram', function (req, res) {
	vsoaCliSer.vsoaClientDatagram()
	res.send('Datgram success!');
});


router.get('/test', function (req, res) {
	res.json({
		errcode:0,
		errmsg:'ok',
		data: 'success'
	})
})

module.exports = router
