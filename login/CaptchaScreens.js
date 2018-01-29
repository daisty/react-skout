import React from 'react';
import {
    TextInput,
    KeyboardAvoidingView,
    Button,
    WebView,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Svg from '../icons/Svg';
import Names from '../icons/Names';
import Image from 'react-native-image-progress';
import Emitters from "../constants/Emitters";

const LOGIN_ERROR_OBJ = {message: "Invalid username or password, please try again", status_code: -12};

export default class LoginScreens extends React.Component {

    state = {
        validError: null,
        valided: false,
        captchaText: null,
        captchaPublicKey:null,
        challenge:null,
        sessionId:this.props.navigation.state.params.sessionId,
        captchaUrl:null,
        validProcess: false,
    };

    componentWillMount(){
        let $self = this;
        let config = {
            url: 'http://dounine.com:3334/api/1/barriers',
            headers: {
                session_id:this.props.navigation.state.params.sessionId
            },
        };
        Log('captchaPublicKey',config)
        axios(config).then(function (response) {
            Log('captchaPublicKey-result',response.data)
            $self.setState({
                captchaPublicKey:response.data.user_data.re_captcha_public_key
            },function () {
                this.getCallenge();
            }.bind($self))
        }).catch(function (error) {
            Log('取验证码key失败',error);
        })
    }

    getCallenge = ()=>{
        let $self = this;
        let config = {
            url: 'http://dounine.com:3333/recaptcha/api/challenge',
            params:{
                k:this.state.captchaPublicKey,
                ajax:1,
                // cachestop:Math.random()
            },
            transformResponse: [function (data) {
                return data;
            }],
        };
        Log('challenge',config)
        axios(config).then(function (response) {
            // Log('challenge-result',response.data)
            let jsonArr = response.data.split('\n');
            jsonArr.splice(0,1);
            jsonArr.splice(0,1);
            jsonArr.splice(jsonArr.length-1,1);
            jsonArr.splice(jsonArr.length-1,1);
            jsonArr.splice(jsonArr.length-1,1);
            jsonArr.splice(jsonArr.length-1,1);
            let challenge = jsonArr[0].slice('challenge : \''.length+4,-2);
            $self.setState({
                challenge,
                captchaUrl:'http://dounine.com:3333/recaptcha/api/image?c='+challenge
            });
        }).catch(function (error) {
            $self.setState({
                validError:'challenge获取失败',
                validProcess:false
            });
            Log('取challenge失败',error);
        })
    }

    static navigationOptions = {
        header: null,
    };

    onReturn = () => {
        this.props.navigation.goBack();
    };

    refreshCaptcha = () =>{
        let $self = this;
        $self.setState({
            validError:null,
            captchaText:null
        });
        let captchaInfo = {
            c: this.state.challenge,
            k: this.state.captchaPublicKey,
            reason: 'r',
            type: 'image',
            lang: 'zh-CN',
            th: '',
        };
        let config = {
            url: 'http://dounine.com:3333/recaptcha/api/reload',
            params: captchaInfo,
            transformResponse: [function (data) {
                return data;
            }],
        };
        Log('reload',config)
        axios(config).then(function (response) {
            let challenge = response.data.slice('Recaptcha.finish_reload('.length+1,-('\', \'image\', null);'.length))
            Log('challenge-new',`https://www.google.com/recaptcha/api/image?c=${challenge}`)
            $self.setState({
                challenge,
                captchaUrl:'http://dounine.com:3333/recaptcha/api/image?c='+challenge
            })
        }).catch(function (error) {
            Log('换验证码错误',error);
        })
    }

    captchaValid = ()=>{
        let $self = this;
        let captchaInfo = {
            recaptcha_challenge_field: this.state.challenge,
            recaptcha_response_field: this.state.captchaText,
        };
        let config = {
            method:'POST',
            url: 'http://dounine.com:3334/api/1/barriers',
            headers: {
                session_id:this.state.sessionId
            },
            data: captchaInfo,
            transformResponse: [function (data) {
                return data;
            }],
        };
        $self.setState({
            validError:null,
            validProcess:true
        });
        axios(config).then(function (response) {
            Log('登录成功',response);
            Emitters.DEM.emit(Emitters.AJAX_LOGIN_SUCCESS,{
                sessionId:$self.state.sessionId
            });
            $self.setState({
                validError:null,
                validProcess:false
            });
        }).catch(function (error) {
            $self.setState({
                validProcess:false
            });
            if(error.response){
                Log(error.response.data)
                let data = (typeof error.response.data)==='string'?JSON.parse(error.response.data):error.response.data
                if(data.message==='Make sure you insert your code correctly.'){
                    $self.setState({
                        captchaText:null,
                        validError:'验证码输入有误,请重新输入'
                    });
                }
            }
        })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#F5F0F6'
                }}
            >

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            height: 64,
                            backgroundColor: '#0F67AE',
                            flexDirection: 'row',
                            borderBottomColor: '#CCC',
                            borderBottomWidth: 1
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
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        borderRadius: 2,
                                        borderWidth: 1,
                                        borderColor: '#E0E0E0',
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}
                                >
                                    {
                                        this.state.captchaUrl?
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: 50,
                                            }}
                                            source={{uri: this.state.captchaUrl}}
                                        />:
                                            <ActivityIndicator
                                                animating
                                                model={"large"}
                                                color={"blue"}
                                            />
                                    }

                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop:10,
                                    }}>
                                    <View
                                        style={{
                                            flex: 1
                                        }}
                                    >
                                        <TextInput
                                            style={{
                                                // color: '#FFF',
                                                padding: 12,
                                                borderRadius: 4,
                                                backgroundColor: '#FFF',
                                                borderColor: '#E0E0E0',
                                                borderWidth: 1
                                            }}
                                            maxLength={30}
                                            onChangeText={(captchaText) => {
                                                let valided = false;
                                                if (captchaText) {
                                                    valided = true;
                                                }
                                                this.setState({captchaText, valided})
                                            }}
                                            value={this.state.captchaText}
                                            placeholder="请输入..."
                                            // placeholderTextColor='rgba(255,255,255,0.4)'
                                        />
                                    </View>

                                    <TouchableOpacity
                                        onPress={this.refreshCaptcha}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        <View
                                        >
                                            <Svg icon={Names.refresh} color={'#778FA3'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.validError &&
                                    <View
                                        style={{
                                            marginTop: 10,
                                            height: 22,
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            alignItems: 'center',
                                            borderRadius: 11
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#E95442'
                                            }}
                                        >{this.state.validError}</Text>
                                    </View>
                                }

                                <View>
                                    <TouchableOpacity
                                        onPress={this.captchaValid}
                                        activeOpacity={this.state.valided ? 0.3 : 1}
                                        style={{
                                            marginTop: 30,
                                            height: 40,
                                            justifyContent: 'center',
                                            backgroundColor: '#E95442',
                                            alignItems: 'center',
                                            borderRadius: 4
                                        }}
                                    >
                                        <View

                                        >
                                            {
                                                this.state.validProcess ?
                                                    <ActivityIndicator
                                                        animating
                                                        model={"small"}
                                                        color={"#000"}
                                                    /> : <Text
                                                        style={{
                                                            color: this.state.valided ? '#FFF' : '#666'
                                                        }}
                                                    >验证</Text>
                                            }
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </KeyboardAvoidingView>

                    </View>
                </View>
            </View>
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
