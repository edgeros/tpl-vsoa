/**
* Copyright (c) 2023 EdgerOS Team.
* All rights reserved.
*
* Detailed license information can be found in the LICENSE file.
*
* Author : Fu Wenhao <fuwenhao@acoinfo.com>
* File   : vsoa-client-service.js
* Desc   : Initialize a" vsoa-client" and listen server
*/
const vsoa = require('vsoa')
const Tcp = require('tcp');

/**
 * init vsoa client
 * @param {object} config
 * @param {string} config.addr vsoa 服务地址
 * @param {number} config.port port 服务端口
 * @param {object} server io服务
 */
const addr='127.0.0.1'
let io=''
let url=''
let content={}
/* 初始化服务端和io */
function vsoaClientInit(config,server) {
    io=server
    var saddr = Tcp.sockaddr(addr, config.port);
    vsoaClient.connect(saddr, (err, info) => {
        console.log('[tpl vsoa] vsoa client connect to server:callback]', info)
    })
    io.on('connection',(socket)=>{
        socket.on('urlpath',(arg)=>{
            url=arg
        })
        socket.on('bags',(arg)=>{
            content=arg
        })
    })
}

/* Client实例 */
const vsoaClient = new vsoa.Client({
    pingInterval: 5000, 
    pingTimeout: 3000, 
    pingLost: 5
})

/* 监听客户端与服务端连接是否成功 */
vsoaClient.on('connect',  (info)=> {
    console.log('[tpl vsoa] vsoa client connect to server:event]', info)
})

/* 监听客户端与服务端连接失败的信息 */
vsoaClient.on('error',(err)=>{
    console.log('[tpl vsoa] vsoa client connect error]', err)
})

/* 监听客户端收到服务端发送的消息，每当收到一条消息时，都会发送一条消息到前端 */
vsoaClient.on('message',(url,payload)=>{
    console.log(`[tpl vsoa] the message from ${url}:` ,JSON.stringify(payload))
    switch (url){
        case '/a':
            io.emit('subscribeSerA',[url,payload]);
            break;
        case '/a/b':
            io.emit('subscribeSerB',[url,payload]);
    }
})

/* 发布订阅模式 */
//客户端订阅服务端发布的服务
function vsoaClientSub(){
    vsoaClient.subscribe(url, (err) => {
        if(err){
            console.error('[tpl vsoa] subscribe error',err)
        }
    })
}

//客户端取消服务端的服务
function vsoaClientUnsub(){
    vsoaClient.unsubscribe(url, (err) => {
        if(err){
            console.error('[tpl vsoa] unsubscribe error',err)
        }else{
            console.log('[tpl vsoa] vsoa client unsubscribe:callback]',`service ${url} is unsubscribed`)
        }
    })
}

/*RPC模式*/
//RPC call
function vsoaClientCall(){
    const url='/time'
    return new Promise((resolve,reject)=>{
        vsoaClient.call(url,function(error,payload){
            if(error){
                reject(error)
            }else{
                console.log('[tpl vsoa] vsoa client call:callback]',JSON.stringify(payload))
                resolve(payload)
            }
        })
    })
}

//RPC同步
function vsoaClientFetch(){
    const url='/count'
    return  vsoaClient.fetch(url)
}

/* Datagram方式传递参数 */
function vsoaClientDatagram(){
    const url='/light'
    vsoaClient.datagram(url,{param:content},true);
    io.emit('datagram',{param:content})
}

module.exports = {
    vsoaClientInit,
    vsoaClientSub,
    vsoaClientUnsub,
    vsoaClientCall,
    vsoaClientFetch,
    vsoaClientDatagram,
}