import { PubSub } from 'pubsub-js';
let websocket,
  lockReconnect = false;
let createWebSocket = (url) => {
  websocket = new WebSocket(url);
  websocket.onopen = function () {
    heartCheck.reset().start();
  };
  websocket.onerror = function () {
    reconnect(url);
  };
  websocket.onclose = function (e) {
    console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
    if (e.code === 1002 || e.code === 1005) {
    } else {
      reconnect(url);
    }
  };
  websocket.onmessage = function (event) {
    lockReconnect = true;
    const data = JSON.parse(event.data);
    PubSub.publish('message', data);
    //event 为服务端传输的消息，在这里可以处理
  };
};
let reconnect = (url) => {
  if (lockReconnect) return;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
  }, 4000);
};
let heartCheck = {
  timeout: 30000, //60秒
  timeoutObj: null,
  reset: function () {
    clearInterval(this.timeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setInterval(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      websocket.send('HeartBeat');
    }, this.timeout);
  },
};
// 传值
let sendWebSocket = (data) => {
  if (data) {
    websocket.send(JSON.stringify(data));
  }
};
//关闭连接
let closeWebSocket = () => {
  websocket && websocket.close();
  heartCheck.reset().start();
};
export { websocket, createWebSocket, closeWebSocket, sendWebSocket };
