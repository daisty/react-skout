import React from 'react';
import {
    ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, TextInput, View, Text, StyleSheet
} from 'react-native';
import Emitters from '../../../constants/Emitters';
import Svg from '../../../icons/Svg';
import Names from '../../../icons/Names';
import Language from './Language';

class Translate extends React.Component {

    static navigationOptions = ({
                                    navigation,
                                    screenProps
                                }) => ({
        headerTitle: '翻译小助手',
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    Emitters.DEM.emit(Emitters.TRANSLATE_SEND)
                }}
            >
                <View>
                    <Text style={styles.send}>发送</Text>
                </View>

            </TouchableOpacity>
        )
    });

    componentWillMount() {
        let $self = this;
        $self.translateSend = Emitters.DEM.addListener(Emitters.TRANSLATE_SEND, function () {
            $self.translateSendMessage();
        });
        $self.translateReturn = Emitters.DEM.addListener(Emitters.TRANSLATE_RETURN, function () {
            $self.props.navigation.goBack();
        });
    }

    componentWillUnmount() {
        this.translateSend.remove();
        this.translateReturn.remove();
    }

    isEnterKey = false;

    state = {
        choseLanguageShow: false,
        translateText: null,
        translateFocus: false,
        translatePress: false,
        translateResults: [],
        choseLanguage: {
            id: 'zh-cn',
            name: 'Chinese Simplified',
            value: '中文(简体)',
        },
        choseLanguageResult: {
            id: 'en',
            name: 'English',
            value: '',
        }
    };

    choseLanguageCallback = (choseLanguage) => {
        if (this.state.choseLanguageSource === true) {
            this.setState({
                choseLanguageShow: false,
                choseLanguage: choseLanguage,
            });
            Log(choseLanguage.value)
        } else {
            this.setState({
                choseLanguageShow: false,
                choseLanguageResult: choseLanguage,
            });
        }

    };

    choseLanguage = () => {
        this.setState({
            choseLanguageShow: true,
            choseLanguageSource: true
        });
    };

    choseLanguageResult = () => {
        this.setState({
            choseLanguageShow: true,
            choseLanguageSource: false
        });
    };

    translateSendMessage = (translateResult) => {
        if (!translateResult) {
            if (this.state.translateText === "") {
            }
            Emitters.DEM.emit(Emitters.SEND_MESSAGE, this.state.translateText)
        } else {//发送未经翻译的消息
            Emitters.DEM.emit(Emitters.SEND_MESSAGE, translateResult)
        }
        this.props.navigation.goBack();
    };

    delTranslateText = () => {
        this.refs.translateInput.blur();
        this.setState({
            translateResults: [],
            translateFocus: false,
            translateText: null
        })
    };

    onChangeText = (translateText) => {
        if (this.isEnterKey === false) {
            if (translateText === "") {
                this.setState({
                    translateText: null
                });
            } else {
                this.setState({
                    translateText
                });
            }
        } else {
            this.setState({
                translatePress: true,
                translateResults: []
            });
            let $self = this;
            let resourceLanguage = this.state.choseLanguage.id;
            let targetLanguage = this.state.choseLanguageResult.id;
            let translateResource = this.state.translateText;
            let postData = {
                resourceLanguage,
                targetLanguage,
                translateResource
            }
            let config = {
                url:'http://dounine.com:3333/translate',
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
                data: postData
            };
            axios(config)
                .then(function (res) {
                    $self.setState({
                        translatePress: false,
                        translateResults: res.data
                    })
                }).catch(function (err) {
                Log(err)
            });
        }

    };

    getTranslateOperator = () => {

        return <View
            style={styles.inputTextOperator}>
            <View
                style={{flex: 1, marginLeft: 10,}}
            >
            </View>
            <View
                style={{flex: 1}}
            >
                <Svg icon={Names.speaker} size={20} color="#2E2E2E"/>
            </View>
            <View
                style={{flex: 1}}
            >
                <Svg icon={Names.collection} size={20} color="#2E2E2E"/>
            </View>
            <View
                style={{flex: 1}}
            >
                <Svg icon={Names.copy} size={20} color="#2E2E2E"/>
            </View>
            <View
                style={{flex: 1}}
            >
                <TouchableOpacity
                    onPress={() => {
                        Emitters.DEM.emit(Emitters.TRANSLATE_SEND)
                    }}
                >
                    <View>
                        <Svg icon={Names.translateSend} size={20} color="#2E2E2E"/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    };

    translateFocus = () => {
        this.setState({
            translateFocus: true,
        })
    };

    _handleKeyPress = (e) => {
        if (e.nativeEvent.key == "Enter") {
            this.isEnterKey = true;
            this.refs.translateInput.blur();
            setTimeout(function () {
                this.setState({
                    translateFocus: false
                })
            }.bind(this))

        } else {
            this.isEnterKey = false;

        }
    };

    render() {
        let $self = this;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#F2F2F2'
                }}
            >
                <View
                    style={{
                        height: 50,
                        flexDirection: 'row',
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 1,
                        backgroundColor: '#FFFFFF'
                    }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={this.choseLanguage}
                        >
                            <View>
                                <Text>{this.state.choseLanguage.value || this.state.choseLanguage.name}</Text>
                            </View>
                            <View
                            >
                                <Svg size={12} color="#4A4A4A" icon={Names.down} style={styles.down}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Svg size={20} color="#4A4A4A" icon={Names.translateLang}/>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={this.choseLanguageResult}
                        >
                            <View>
                                <Text>{this.state.choseLanguageResult.value || this.state.choseLanguageResult.name}</Text>
                            </View>
                            <View
                            >
                                <Svg size={12} color="#4A4A4A" icon={Names.down} style={styles.down}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Language choseLanguageCallback={this.choseLanguageCallback}
                                  defaultChoseLanguage={this.state.choseLanguage}
                                  choseLanguageShow={this.state.choseLanguageShow}/>
                    </View>
                </View>
                <View
                    style={{
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 1,
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <View
                        style={styles.translateInputTextView}
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <TextInput
                                keyboardType="default"
                                returnKeyType="done"
                                ref={"translateInput"}
                                onChangeText={this.onChangeText}
                                //autoFocus={true}
                                value={this.state.translateText}
                                onFocus={this.translateFocus}
                                onKeyPress={this._handleKeyPress}
                                multiline={true}
                                numberOfLines={4}
                                maxLength={200}
                                placeholder="输入翻译..."
                                style={{
                                    flex: 1,
                                    paddingLeft: 8,
                                    paddingTop: 6,
                                    fontSize: 16,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                marginHorizontal: 10,
                                marginTop: 10
                            }}
                        >
                            {
                                (this.state.translateFocus || this.state.translateText !== null) &&
                                <TouchableOpacity
                                    onPress={this.delTranslateText}
                                >
                                    <Svg icon={Names.close} size={16} color='#9E9E9E'/>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>

                    {
                        this.state.translateText !== null &&
                        this.getTranslateOperator()
                    }
                </View>

                <View
                    style={styles.translateResult}
                >
                    <View
                        style={{
                            marginVertical: 6,
                        }}
                    >
                        {
                            this.state.translatePress &&
                            <ActivityIndicator
                                animating={true}
                                style={styles.loadingIcon}
                                size="small"/>
                        }

                    </View>
                    <View
                        style={{
                            backgroundColor: '#F2F2F2',
                        }}>
                        {
                            this.state.translateResults.map(function (d) {
                                return (
                                    <View
                                        key={Math.random()}
                                        style={{
                                            borderTopColor: '#E7E7E6',
                                            borderTopWidth: 1,
                                            borderBottomColor: '#E7E7E6',
                                            borderBottomWidth: 1,
                                            backgroundColor: '#FFF',
                                            marginBottom: 10
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row'
                                            }}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    padding: 10
                                                }}
                                            >
                                                <Text
                                                    style={{fontSize: 14}}
                                                >
                                                    {
                                                        d.value
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={styles.inputTextOperator}>
                                            <View
                                                style={{flex: 1, marginLeft: 10,}}
                                            >
                                            </View>
                                            <View
                                                style={{flex: 1}}
                                            >
                                                <Svg icon={Names.speaker} size={20} color="#2E2E2E"/>
                                            </View>
                                            <View
                                                style={{flex: 1}}
                                            >
                                                <Svg icon={Names.collection} size={20} color="#2E2E2E"/>
                                            </View>
                                            <View
                                                style={{flex: 1}}
                                            >
                                                <Svg icon={Names.copy} size={20} color="#2E2E2E"/>
                                            </View>
                                            <View
                                                style={{flex: 1}}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => $self.translateSendMessage(d.value)}
                                                >
                                                    <Svg icon={Names.translateSend} size={20} color="#2E2E2E"/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }


                    </View>
                    {
                        this.state.translateFocus &&
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.delTranslateText}
                            style={
                                styles.translateUvisable
                            }
                        >
                        </TouchableOpacity>

                    }

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    send: {
        color: '#4A4A4A',
        fontSize: 16,
        marginRight: 14
    },
    translateLanugChose: {
        flex: 1,
        flexDirection: 'row'
    },
    down: {
        marginLeft: 6
    },
    translateInputTextView: {
        height: 76,
        flexDirection: 'row',
    },
    inputTextOperator: {
        height: 40,
        flexDirection: 'row',
        borderTopColor: '#F2F2F2',
        borderTopWidth: 0,
        alignItems: 'center',
    },
    translateResult: {
        flex: 1
    },
    translateUvisable: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#666666'
    },
    loadingIcon: {
        marginVertical: 6,
    }
});

export default Translate;