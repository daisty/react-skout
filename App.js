/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Platform,
    AsyncStorage,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import MainNavigation from './navigation/MainTabNavigator';
import StartupNavs from './startup/StartupNavs';
import SocketListener from './constants/SocketListener';
import Log from './constants/Log';//为方便全局使用
import './constants/Properties';
import Svg from './icons/Svg';
import Names from './icons/Names';
import Translate from './components/chat/translate/Translate';
import Voice from './navigation/voice/Voice';
import UserUtils from './constants/UserUtils';
import Emitters from './constants/Emitters';
import URLS from './constants/Urls';
import axios from 'axios';

global.LOGIN_SUCCESS = false;//全局是否登录成功
global.SESSION_ID = "";//全局会话
global.USER_ID = "";//全局登录用户ID
global.Log = Log;
global.URLS = URLS;

global.FORM_URLENCODED = function (obj) {
    let nameAndValues = [];
    for (let name in obj) {
        nameAndValues.push(`${name}=` + obj[name]);
    }
    return nameAndValues.join('&');
};

global.transformResponseJson = [
    function (data) {
        return JSON.parse(data);
    }
]
global.transformResponseText = [
    function (data) {
        return data;
    }
]

global.axios = axios.create({
    // baseURL:"https://some-domain.com/api/",
    timeout: 10 * 1000,
    crossDomain: true,
    transformRequest: [function (data) {
        if ((typeof data) === 'object') {
            return FORM_URLENCODED(data)
        }
        return data;
    }],
    transformResponse: transformResponseJson,
    // headers: {'X-Custom-Header':'foobar'}
});

XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

export default class App extends React.Component{

  loginSuccess = null;
  loginSuccess403 = null;



    constructor() {
        super();
        this.state = {
            startUp: true
        };
        let $self = this;
        let startUp = false;

        //程序启动界面在这里初始化

        // '<Root:11>aa</Root:11>'.xml2js(function (json) {
        //     Log(json)
        // });

        // parseString('<Root:11>aa</Root:11>',(err,result)=>{
        //     Log('xml',err,result)
        // });

        UserUtils.readSessionId(function (err, result) {
            if (result) {
                $self.setState({
                    startUp: false
                });
            } else {
                $self.setState({
                    startUp: true
                });
            }
        });
    }

    componentWillMount() {
        let $self = this;


        this.loginSuccess403 = Emitters.DEM.addListener(Emitters.AJAX_LOGIN_403, function (result) {
            global.LOGIN_SUCCESS = false;
            global.SESSION_ID = "";
            UserUtils.clearSessionId();
            $self.setState({
                startUp: true,
            });
        });

        this.loginSuccess = Emitters.DEM.addListener(Emitters.AJAX_LOGIN_SUCCESS, function (result) {
            global.LOGIN_SUCCESS = true;
            global.SESSION_ID = result.sessionId;
            global.USER_ID = result.userId;
            if (!result.cache) {//使用缓存登录,不用再登录缓步sessionId
                UserUtils.saveSessionId(result.sessionId);
            } else {
                Log('缓存登录', result)
            }
            if ($self.state.startUp === true) {
                $self.setState({
                    startUp: false,
                });
            }
        });

    }

    componentWillUnmount() {
        this.loginSuccess.remove();
        this.loginSuccess403.remove();
    }

    renderMainNavigation() {
        return <MainNavigation/>
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Voice/>*/}
                <SocketListener/>
                {
                    this.state.startUp ?
                        <StartupNavs/>
                        : this.renderMainNavigation()
                }
                {/*<Translate/>*/}
                {/*<CaptchaWebView/>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
