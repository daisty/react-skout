import React from 'react';
import {
    TextInput,
    KeyboardAvoidingView,
    Button,
    WebView,
    Image,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Svg from '../icons/Svg';
import Names from '../icons/Names';
import {BlurView, VibrancyView} from 'react-native-blur';
import Emitters from "../constants/Emitters";

const LOGIN_ERROR_OBJ = {message: "Invalid username or password, please try again", status_code: -12};

export default class LoginScreens extends React.Component {

    state = {
        loginError: null,
        loginProcess: false,
        valided: true,
        usernameText: 'zhangyao123',
        passwordText: 'lailake201314'
    };

    static navigationOptions = {
        header: null,
    };

    onReturn = () => {
        this.props.navigation.goBack();
    };

    login = () => {
        let $self = this;
        if (this.state.valided === false) {
            return false;
        }
        $self.setState({
            loginError: null,
            loginProcess: true,
        });
        let userInfo = {
            user: this.state.usernameText,
            pass: this.state.passwordText,
            ui: 'freya',
            application_code: 'd46dbe487d5baaa0b176cb55d3bc452c',
        };
        let config = {
            method: 'POST',
            url: 'http://dounine.com:3334/api/1/auth/login2',
            data: userInfo,
        };

        axios(config).then(function (res) {
            let a = res.data;
            if(a.description==='Please upgrade to the latest version available.'){//验证码
                $self.setState({
                    loginProcess:false,
                },function () {
                    $self.props.navigation.navigate('Captcha',{sessionId:a.session_id})
                });
            }else{
                Emitters.DEM.emit(Emitters.AJAX_LOGIN_SUCCESS,{
                    sessionId:a.session_id,
                    userId:a.id,
                });
            }
        }).catch(function (error) {
            if (error.response) {
                Log('error-response',error.response)
                //请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
                if(error.response.data.message===LOGIN_ERROR_OBJ.message){
                    $self.setState({
                        loginError: '你输入用户名或者密码错误!',
                        loginProcess: false
                    })
                }
            } else {
                Log('error-message',error.message);
                $self.setState({
                    loginError: error.message,
                    loginProcess: false
                })
            }
        });
    };

    render() {
        return (
            <ImageBackground
                source={require('../img/banner1.jpg')}
                style={{
                    flex: 1,
                }}
            >
                <VibrancyView blurType="dark" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    flex: 1,
                }}/>

                <View
                    style={{
                        flex: 1
                    }}
                >
                    <View
                        style={{
                            height: 64,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            flexDirection: 'row'
                        }}>
                        <View>
                            <TouchableOpacity
                                onPress={this.onReturn}
                                style={styles.container}>
                                <View
                                    style={styles.returnView}>
                                    <View>
                                        <Svg icon={Names.return} size="30" style={styles.icon} color="#FFF"/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            padding: 20
                        }}
                    >

                        <KeyboardAvoidingView
                            behavior={"padding"}
                        >
                            <View
                                style={{marginBottom: 70}}
                            >
                                <View>
                                    <TextInput
                                        style={{
                                            color: '#FFF',
                                            padding: 12,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            borderColor: '#FFF'
                                        }}
                                        onChangeText={(usernameText) => {
                                            let valided = false;
                                            if (usernameText && this.state.passwordText) {
                                                valided = true;
                                            }
                                            this.setState({usernameText, valided})
                                        }}
                                        value={this.state.usernameText}
                                        maxLength={30}
                                        placeholder="用户名"
                                        placeholderTextColor='rgba(255,255,255,0.4)'
                                    />
                                </View>
                                <View
                                    style={{
                                        marginTop: 10
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            color: '#FFF',
                                            padding: 12,
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            borderColor: '#FFF'
                                        }}
                                        maxLength={30}
                                        onChangeText={(passwordText) => {
                                            let valided = false;
                                            if (passwordText && this.state.usernameText) {
                                                valided = true;
                                            }
                                            this.setState({passwordText, valided})
                                        }}
                                        value={this.state.passwordText}
                                        secureTextEntry={true}
                                        placeholder="密码"
                                        placeholderTextColor='rgba(255,255,255,0.4)'
                                    />
                                </View>
                                {
                                    this.state.loginError &&
                                    <View
                                        style={{
                                            marginTop: 10,
                                            height: 22,
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            alignItems: 'center',
                                            borderRadius: 11
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#FFF'
                                            }}
                                        >{this.state.loginError}</Text>
                                    </View>
                                }

                                <View>
                                    <TouchableOpacity
                                        onPress={this.login}
                                        activeOpacity={this.state.valided ? 0.3 : 1}
                                        style={{
                                            marginTop:30,
                                            height: 40,
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                            alignItems: 'center',
                                            borderRadius: 4
                                        }}
                                    >
                                        <View>
                                            {
                                                this.state.loginProcess ?
                                                    <ActivityIndicator
                                                        animating
                                                        model={"small"}
                                                        color={"#000"}
                                                    /> : <Text
                                                        style={{
                                                            color: this.state.valided ? '#000' : '#666'
                                                        }}
                                                    >登录</Text>
                                            }
                                        </View>



                                    </TouchableOpacity>


                                    <View>
                                        <TouchableOpacity
                                            onPress={this.login}
                                            style={{
                                                marginTop: 10,
                                                height: 20,
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(255,255,255,0)',
                                                alignItems: 'center',
                                                borderRadius: 4
                                            }}
                                        >
                                            <View>
                                                <Text
                                                    style={{
                                                        color: '#FFF'
                                                    }}
                                                >忘记密码?</Text>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>

                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 26,
        flexDirection: 'row',
        marginLeft: 2,
        alignItems: 'center',
    },
    icon: {
        marginTop: 60,
        width: 26,
        height: 30,
    },
    returnView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    returnText: {
        fontSize: 17,
        color: '#177EFB'
    }
});
