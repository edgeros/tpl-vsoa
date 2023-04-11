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


module.exports = {
    vsoaClientInit
}