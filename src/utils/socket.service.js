export default class SocketService {
    // 单例
    static instance = null;
    static get Instance() {
        if(!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }
    ws = null

    callBackMapping = {}

    connected = false

    sendRetryCount = 0

    connectRetryCount = 0
    // 连接方法
    connect() {
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持webSocket')
        } 
        this.ws = new WebSocket('ws://localhost:9998')

        // 连接成功
        this.ws.onopen = () => {
            this.connected = true;
            this.connectRetryCount = 0;
            console.log('onopen')
        }
        // 连接失败
        this.ws.onclose = () => {
            this.connected = false;
            this.connectRetryCount++;
            console.log('onclose')
            setTimeout(() => {
                this.connect();
            }, this.connectRetryCount * 500)
        }
        // 获取数据
        this.ws.onmessage = msg => {
            const recvData = JSON.parse(msg.data);
            const socketType =  recvData.socketType;
            if (this.callBackMapping[socketType]) {
                const action = recvData.action;
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data);
                    this.callBackMapping[socketType].call(this, realData);
                } else if(action === 'fullScreen') {

                } else if (action === 'themeChange') {

                }
            }
        }
    }

    // 回调函数注册
    registerCallBack (socketType, callBack) {
        this.callBackMapping[socketType] = callBack;
    }
    send (arg) {
        if (this.connected) {
            this.sendRetryCount = 0;
            this.ws.send(JSON.stringify(arg));
        } else {
            this.sendRetryCount++;
            setTimeout(() => {
                this.send(arg);
            }, this.sendRetryCount * 500)
        }
    }
    // 重置回调函数
    unRegisterCallBack (socketType) {
        this.callBackMapping[socketType] = null;
    }
    
}