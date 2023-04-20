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
 */
function vsoaClientInit(config) {
    var saddr = Tcp.sockaddr('127.0.0.1', config.port);
    vsoaClient.connect(saddr, (err, info) => {
        console.log('[tpl vsoa] vsoa client connect to server:callback]', info)
    })
}

/**
 * init io and get data from FrontEnd
*/
let io=null
let url=''
let content={}
function createSocketIO(server){
    if(server){
        io=server
        io.on('connection',(socket)=>{
            socket.on('url1',(arg)=>{
                url=arg
            })
            socket.on('url2',(arg)=>{
                url=arg
            })
            socket.on('bags',(arg)=>{
                content=arg
                console.log('------------',content)
            })
        })
    }
}

//Client 实例
const vsoaClient = new vsoa.Client({
    pingInterval: 5000, 
    pingTimeout: 3000, 
    pingLost: 5
})



//监听客户端与服务端连接是否成功
vsoaClient.on('connect',  (info)=> {
    console.log('[tpl vsoa] vsoa client connect to server:event]', info)
})

//监听客户端与服务端连接失败的信息
vsoaClient.on('error',(err)=>{
    console.log('[tpl vsoa] vsoa client connect error]', err)
})

//监听客户端收到服务端发送的消息，每当收到一条消息时，都会发送一条消息
vsoaClient.on('message',(url,payload)=>{
    console.log(`[tpl vsoa] the message from ${url}:` ,JSON.stringify(payload))
    switch (url){
        case '/a':
            io.emit('subscribe1',[url,payload]);
            break;
        case '/a/b':
            io.emit('subscribe2',[url,payload]);
    }
})

//发布订阅模式
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


//RPC call
function vsoaClientCall(){
    return new Promise((resolve,reject)=>{
        vsoaClient.call('/time',function(error,payload){
            if(error){
                reject(error)
            }else{
                console.log('[tpl vsoa] vsoa client call:callback]',JSON.stringify(payload))
                resolve(payload)
            }
        })
    })
}

//RPC异步模式
function vsoaClientFetch(){
    return new Promise((resolve,reject)=>{ 
        vsoaClient.fetch('/count')
        .then((payload,tunid)=>{
            console.log('[tpl vsoa] vsoa client fetch:callback]',JSON.stringify(payload))
            resolve(payload)
        })
    })
}



//Datagram方式传递参数
function vsoaClientDatagram(){
    vsoaClient.datagram('/light',{param:content},true);
    io.emit('datagram',{param:content})
}

module.exports = {
    vsoaClientInit,
    vsoaClientSub,
    vsoaClientUnsub,
    vsoaClientCall,
    vsoaClientFetch,
    vsoaClientDatagram,
    createSocketIO
}