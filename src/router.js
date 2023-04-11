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
	res.send('Hello world!');
});


/**
 * 
 */
 router.get('/unsubscribe', function (req, res) {
	res.send('Hello world!');
});

/**
 * 
 */
 router.get('/call', function (req, res) {
	res.send('Hello world!');
});


/**
 * 
 */
 router.get('/fetch', function (req, res) {
	res.send('Hello world!');
});



/**
 * 
 */
router.get('/datagram', function (req, res) {
	res.send('Hello world!');
});



module.exports = router
