/* ----------------------绑定DOM----------------------*/
const list = document.querySelector('.list');
const popContent = document.querySelector('.popup_content')
const bagcontent = document.querySelector('.bagcontent')
const sendbag = document.querySelector('.sendbag')

/* ---------------------- 初始化网络----------------------*/
let token = ''
let srand = ''
/* 定义socket */
const socket = io(`https://${location.host}`, {
  path: '/socket.io',
  reconnectionDelayMax: 10000,
});

/* edger 初始化*/ 
edger.token().then(data => {
  var { token, srand } = data;
  token = data.token;
  srand = data.srand;
  init();
}).catch(error => {
  console.error(error);
});

/* 监听token更新 */ 
edger.onAction('token', (data) => {
  token = data.token;
  srand = data.srand;
});

/* 获取网络权限 */ 
function init() {
  edger.permission.request({
    code: ['network'],
    type: 'permissions'
  }).then((data) => {
    console.log('申请网络权限:', data)
  }).catch(error => {
    console.error(error);
  });
}

/* ---------------------- DOM事件----------------------*/
/* 清除数据 */
function clearData() {
  list.innerHTML = '';
}

/* 将数据展示在文本框 */
/**
 * @param {object} data 数组对象
*/
function listData(data){
  const Ele = document.createElement('li')
  if(data instanceof Array){
    let content = data[1].param.msg
    let text = `收到来自  ${data[0]}  的服务,内容为: ${content}`
    Ele.textContent = text;
    list.appendChild(Ele)
  }
  else{
    let content = data.param
    let text = `发送到服务端的内容为: ${content}`
    Ele.textContent = text;
    list.appendChild(Ele)
  }
}

/* Switch控件绑定事件,开和关对应的触发订阅和取消订阅两种行为 */
/**
 * @param {object} element 鼠标点击事件对象
 * @param {string} urlpath 要跳转的页面的URL地址路径字符串
 */
function getData(element) {
  const urlpath = element.name
  if (element.checked) {
    sendSub(urlpath)
  }
  else {
    sendUnsub(urlpath)
    list.innerHTML += `<li>地址为'${urlpath}'的服务已经取消订阅</li>`
  }
}

/* RPC弹出框事件 */
function showPopup(element) {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  if (element.name === 'callbtn') {
    const content = sendCall()
    content.then((data) => {
      popContent.innerHTML = `现在的时间是:${data.today}`
    })
  }
  if (element.name === 'fetchbtn') {
    const content = sendFetch()
    content.then((data) => {
      popContent.innerHTML = `收到的消息是:${data.count}`
    })
  }
}

/* RPC弹出框关闭 */
function hidePopup() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  popContent.innerHTML = ''
}
 
/* 发包到后台事件 */
sendbag.addEventListener('click',function(){
  sendDatagram();
  bagcontent.value=null
})

/* ---------------------- 获取后台服务----------------------*/

/* 用于接收从后端发至前端的消息 */
socket.on('connect', function () {
  socket.on('subscribeSerA', (data) => {
    listData(data)
  })
  socket.on('subscribeSerB', (data) => {
    listData(data)
  })
  socket.on('datagram', (data) => {
    listData(data)
  })
})

/* 发送订阅请求 */
function sendSub(urlpath) {
  socket.emit('urlpath', urlpath)
  httpSend('subscribe')
}

/* 发送取消订阅请求 */
function sendUnsub(urlpath) {
  socket.emit('urlpath', urlpath)
  httpSend('unsubscribe')
}

/* 发送RPC消息请求 */
async function sendCall() {
  const data = await httpSend('call')
  const time = await data.json()
  return time.param
}

// 发送同步RPC请求
async function sendFetch() {
  const data = await httpSend('fetch')
  const msg = await data.json()
  return msg.param
}

/* 发包 */ 
function sendDatagram() {
  const vals = bagcontent.value
  if (vals) {
    socket.emit('bags', vals)
    httpSend('datagram')
  }
}


 /* http 请求链接*/
async function httpSend(router) {
  try {
    const res = await fetch(`/api/${router}`, {
      method: 'GET',
      // body: JSON.stringify(data),// data can be `string` or {object}
      headers: new Headers({
        "edger-token": token,
        "edger-srand": srand,
      })
    })
    return res;
  } catch (err) {
    console.log("HTTP: Send Error:", err)
  }
}
