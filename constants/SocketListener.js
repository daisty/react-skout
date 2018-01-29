import React from 'react';
import Emitters from './Emitters';
import UserUtils from './UserUtils';
import SocketUtils from './SocketUtils';

const sessionId = 'f0bb9f2c-95db-4b36-8c30-ba68e3247ce0';
const DEM = Emitters.DEM;

let lastDate = null;

class SocketChat extends React.Component {

    componentWillMount() {
        this.socketInit();
        //登录中
        DEM.addListener(Emitters.SOCKET_LOGIN_LOADING, this.socketLoginLoading);
        //登录失败
        DEM.addListener(Emitters.SOCKET_LOGIN_FAILED, this.socketLoginFailed);
        //登录后再操作
        DEM.addListener(Emitters.SOCKET_LOGIN_BEFORE, this.socketLoginBefore);
        //重新登录
        DEM.addListener(Emitters.SOCKET_LOGIN_REPEAT, this.socketLoginRepeat);
        //登录成功
        DEM.addListener(Emitters.SOCKET_LOGIN_SUCCESS, this.socketLoginSuccess);
        //聊天
        DEM.addListener(Emitters.SOCKET_CHAT, this.socketChat);
        //消息通知
        DEM.addListener(Emitters.SOCKET_NOTIFICATION, this.socketNotification);
        //连接
        DEM.addListener(Emitters.SOCKET_CONNECT, this.socketConnect);
        //退出中
        DEM.addListener(Emitters.SOCKET_LOGOUT_LOADING, this.socketLogoutLoading);
        //退出成功
        DEM.addListener(Emitters.SOCKET_LOGOUT_SUCCESS, this.socketLogoutSuccess);

        DEM.addListener(Emitters.AJAX_LOGIN_SUCCESS, this.ajaxLoginSuccess);
    };

    socketInit = () => {
        let $self = this;
        DEM.emit(Emitters.SOCKET_CONNECT_STATUS, 'connecting');
        let num1 = 200;
        let num2 = 100;
        let su = num1 - num2;
        Math.random() * su
        let num = Math.random() * su + num2;
        num = parseInt(num, 10);
        let sockUrl = URLS.SOCKET_WSS.format({
            randomNumber: num,
            randomString: Math.random().toString(36).substr(5)
        });
        Log('socketUrl', sockUrl)
        $self.socket = new WebSocket(sockUrl);
        $self.socket.onopen = function (e) {
            Log('socket打开', e);
            DEM.emit(Emitters.SOCKET_CONNECT_STATUS, 'success');
            $self.loginForSessionId();
        };
        $self.socket.onmessage = function (e) {
            Log('接收消息', e.data)
            if (e.data !== "o") {
                let jsonData = e.data.substring(1);
                if (jsonData === "") return;
                try {
                    let jsonObj = JSON.parse(jsonData);
                    Log('对象',jsonObj)
                    jsonObj = JSON.parse(jsonObj[0])
                    Log('对象1',jsonObj)
                    if (jsonObj.type === 'login-ok') {
                        DEM.emit(Emitters.SOCKET_LOGIN_SUCCESS, jsonObj);
                        $self.socket.loginSuccess = true;
                    } else if (jsonObj.type === 'login-failed') {
                        DEM.emit(Emitters.SOCKET_LOGIN_FAILED, jsonData);
                        DEM.emit(Emitters.AJAX_LOGIN_403);
                        $self.socket.loginSuccess = false;
                    } else if (jsonObj.type === 're-login') {
                        DEM.emit(Emitters.SOCKET_LOGIN_REPEAT, jsonData)
                        $self.sendLoginSessionId();
                    } else if (jsonObj.type === 'chat') {
                        DEM.emit(Emitters.SOCKET_CHAT, jsonData)
                    } else if (jsonObj.type === 'usertyping') {
                        DEM.emit(Emitters.SOCKET_USERTYPING, jsonData)
                    } else if (jsonObj.type === 'notification') {
                        DEM.emit(Emitters.SOCKET_NOTIFICATION, jsonData)
                    } else if (jsonObj.type === 'connect') {
                        DEM.emit(Emitters.SOCKET_CONNECT, jsonData)
                    }
                } catch (e) {
                    Log('系统异常', jsonData, e);
                }

            } else {
                Log('会话维持中', e.data);
                // $self.socket.send('h');
            }
        };
        $self.socket.onerror = function (e) {
            DEM.emit(Emitters.SOCKET_CONNECT_ERROR);
            Log('socket错误', e.message)
        }
        $self.socket.onclose = function (e) {
            DEM.emit(Emitters.SOCKET_CONNECT_CLOSE);
            if (e.reason !== 'Stream end encountered') {
                DEM.emit(Emitters.SOCKET_LOGIN_REPEAT);
                SocketUtils.clear();
            }
            Log('socket关闭', e.code, e.reason)
        }
    };


    loginForSessionId = () => {
        let $self = this;
        var sendLoginSocket = function (id) {
            $self.sessionId = id;
            DEM.emit(Emitters.SOCKET_LOGIN_LOADING);
            $self.socket.send('["{\\"command\\":\\"login\\",\\"sessionId\\":\\"' + id + '\\"}"]')
        }
        if (SESSION_ID !== "") {
            sendLoginSocket(SESSION_ID);
        } else {

            UserUtils.readSessionId(function (err, ii) {
                // Log('用户sessionID', id);
                if (!ii) {
                    // DEM.emit(Emitters.SOCKET_LOGIN_BEFORE);
                    Log('缓存没有sessionId');
                    DEM.emit(Emitters.AJAX_LOGIN_403);
                    return
                }

                sendLoginSocket(ii);
            });
        }


    };

    ajaxLoginSuccess = (result) => {
        Log('ajax登录成功,回到socket', result);
        if (!result.cache) {//已经使用缓存登录成功,不用再绑定sessionId
            this.loginForSessionId();
        }
    };

    socketLoginLoading = () => {
        Log('socket使用sessionId会话绑定中')
    };

    socketLoginFailed = (result) => {
        Log('socket登录失败', result);
    };

    socketLoginRepeat = () => {
        Log('重新登录中');
        this.socketInit();
    }

    socketLoginSuccess = (result) => {
        let $self = this;
        Log('登录成功', result);
        DEM.emit(Emitters.AJAX_LOGIN_SUCCESS, {
            cache: true,
            sessionId: $self.sessionId,
            userId: result.payload.split(' ')[2]
        });
    };

    socketLoginBefore() {
        Log('请登录后再操作')

    }

    socketChat() {
        Log('有聊天')
    }

    socketNotification() {
        Log('有消息通知')
    }

    socketConnect() {
        Log('连接')
    }

    socketLogoutLoading() {
        Log('退出中')
    }

    socketLogoutSuccess() {
        Log('退出成功')
    }

    render() {
        return null
    }
}

export default SocketChat;
