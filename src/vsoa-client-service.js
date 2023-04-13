const vsoa = require('vsoa')
const Tcp = require('tcp');


const vsoaClient = new vsoa.Client({
    pingInterval: 5000, 
    pingTimeout: 3000, 
    pingLost: 5
})
vsoaClient.on('connect',  (info)=> {
    console.log('[tpl vsoa] vsoa client connect to server:event]', info)
})

vsoaClient.on('error',(err)=>{
    console.log('[tpl vsoa] vsoa client connect error]', err)
})


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

//发布订阅模式

//客户端订阅服务端发布的服务
function vsoaClientSub(){
    vsoaClient.subscribe('/a', (err) => {
        if(err){
            console.error('[tpl vsoa] subscribe error',err)
        }else{
            vsoaClient.on('message',(url,payload)=>{
                console.log(`[tpl vsoa] the message from ${url}:` ,JSON.stringify(payload))
            })
        }
    })
}

//客户端取消服务端的服务
function vsoaClientUnsub(){
    vsoaClient.unsubscribe('/a', (err) => {
        if(err){
            console.error('[tpl vsoa] unsubscribe error',err)
        }else{
            console.log('[tpl vsoa] vsoa client unsubscribe:callback]',`service ${'/a'} is unsubscribed`)
        }
    })
}

//RPC访问方式开发
function vsoaClientCall(){
    //设置
    vsoaClient.call('/echo',{method:vsoa.method.SET},{
        param:{hello:'hello'}
    },(error,payload)=>{
        if(error){
            console.error('[tpl vsoa] call set error',error)
        }else{
            console.info('[tpl vsoa] call set:callback]',JSON.stringify(payload))
        }
    })
}

//
function vsoaClientFetch(){
    vsoaClient.fetch('/count').then((payload,tunid)=>{
        console.info('[tpl vsoa] fetch:callback]',JSON.stringify(payload))
    },error=>console.error('[tpl vsoa] fetch error',error.message))
}

//Datagram方式传递参数
function vsoaClientDatagram(){
    vsoaClient.datagram('/light',{param:{world:'world'}},true);
}

module.exports = {
    vsoaClientInit,
    vsoaClientSub,
    vsoaClientUnsub,
    vsoaClientCall,
    vsoaClientFetch,
    vsoaClientDatagram 
}