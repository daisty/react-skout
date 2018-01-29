import React from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    findNodeHandle,
    UIManager,
    TouchableOpacity,
    Keyboard,
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import Layout from '../../../constants/Layout';
import Svg from '../../../icons/Svg';
import OtherFuns from './OtherFuns';
import Emoji from './Emoji';
import Emitters from '../../../constants/Emitters';

const textInputHeight = 32;

export default class ChatInput extends React.Component {

    translateClick = () => {
        Emitters.DEM.emit(Emitters.SWITCH_TRANSLATE, 'hello guys. how are you')
    };

    state = {
        keyboardHeight: 0,
        inputBoxShow: false,
        inputText: null,
        switchFun: null,
        openEmojiFunction: false,
        defaultValue: '',
        inputBoxTop: Layout.window.nbarHeight - 200
    };


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.sendMessageStatus.remove();
    }

    componentWillMount() {
        let $self = this;
        $self.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        $self.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));
        $self.sendMessageStatus = Emitters.DEM.addListener(Emitters.SEND_MESSAGE_STATUS, function (result) {
            if (result.status === 'sending') {
                $self.setState({
                    inputText: null,
                });
            } else {

            }
        });
    }

    _keyboardWillShow(e) {
        this.setState({
            keyboardHeight: e.endCoordinates.height,
        });
    }

    _keyboardWillHide(e) {
        this.setState({
            keyboardHeight: 0,
        });
        // Emitters.DEM.emit(Emitters.OPERATOR_KEYBOARD, 0)
    }

    sendOrVoice = () => {
        if (this.state.inputText.length > 0) {
            //message
            Emitters.DEM.emit(Emitters.SEND_MESSAGE, this.state.inputText)
        } else {
            //voice
        }
    }


    onChangeText = (inputText) => {
        if(inputText===""){
            this.setState({
                inputText: null
            });
        }else{
            this.setState({
                inputText
            });
        }
    };

    openMore = () => {
        this.setState({
            switchFun: this.state.switchFun === "others" ? null : "others"
        });
    };

    openEmoji = () => {
        this.setState({
            openEmojiFunction: !this.state.openEmojiFunction
        })
    };

    switchFun = () => {
        switch (this.state.switchFun) {
            case "others":
                return <OtherFuns/>
            case "picture":
                return null;
            case "camera":
                return null;
            case "emoji":
                return null;
            case "recent":
                return null;
            case "voice":
                return null;
        }
        return <View/>
    };

    render() {
        const $self = this;
        return (
            <View
                style={{
                    marginBottom: this.state.keyboardHeight
                }}
            >
                <KeyboardAvoidingView
                    style={styles.container}
                >
                    <View
                        style={styles.inputView}
                    >
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View
                                style={styles.inputTextView}
                            >
                                <TextInput
                                    onChangeText={this.onChangeText}
                                    //autoFocus={true}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={styles.inputText}
                                    value={this.state.inputText}
                                    placeholder="请输入..."
                                />
                            </View>
                        </View>
                        <View style={styles.translateView}>
                            <TouchableOpacity
                                onPress={this.translateClick}
                            >
                                <Svg icon="translate" size="22"
                                     color='#676767'/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={styles.chatBottomBarView}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row'
                            }}
                        >
                            <View
                                style={{marginLeft: 8}}
                            >
                                <View
                                    style={styles.chatBottomBarViewItem}
                                >
                                    <TouchableOpacity
                                        onPress={this.openMore}
                                    >
                                        <Svg icon="addcircle" size="22"
                                             color={this.state.switchFun === 'others' ? '#425FD0' : '#656565'}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginLeft: 6,
                                    marginRight: 6
                                }}
                            >
                                <View
                                    style={styles.chatBottomBarViewItem}
                                >
                                    <TouchableOpacity
                                        onPress={this.openEmoji}
                                    >
                                        <Svg icon="emotion" size="22" color="#656565"/>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={styles.chatBottomBarViewItem}
                                >
                                    <TouchableOpacity
                                    >
                                        <Svg icon="picture" size="22" color="#656565"/>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={styles.chatBottomBarViewItem}
                                >
                                    <TouchableOpacity
                                    >
                                        <Svg icon="recent-picture" size="22" color="#656565"/>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={styles.chatBottomBarViewItem}
                                >
                                    <TouchableOpacity
                                    >
                                        <Svg icon="camera-bar" size="22" color="#656565"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={this.sendOrVoice}
                            >
                                <View style={styles.voiceView}>
                                    <View
                                        style={styles.chatBottomBarViewItem}
                                    >
                                        {
                                            $self.state.inputText && <Svg icon="send" size="22" color="#425FD0"/>
                                        }
                                        {
                                            !$self.state.inputText &&
                                            <Svg icon="voice" size="22" color="#656565"/>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                    {
                        this.switchFun()
                    }
                </KeyboardAvoidingView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F6',
        shadowOffset: {width: 0, height: -2},
        shadowColor: '#CCC',
        shadowOpacity: 0.7,
        shadowRadius: 4,
    },
    inputView: {
        marginTop: 4,
        borderTopColor: 'yellow',
        flexDirection: 'row'
    },
    translateView: {
        justifyContent: 'center',
        paddingHorizontal: 8
    },
    inputText: {
        fontSize: 16,
        paddingLeft: 8,
        backgroundColor: '#FFFFFF',
        borderColor: '#EEEEEE',
        borderWidth: 1,
        borderRadius: 4,
        overflow: 'hidden',
        minHeight: textInputHeight,
        maxHeight: 100,
    },
    chatBottomBarView: {
        height: 38,
        flexDirection: 'row'
    },
    chatBottomBarViewItem: {
        flex: 1,
        width:26,
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2
    },
    inputTextView: {
        flex: 1,
        marginLeft: 4,
    },
    voiceView: {
        height: 38,
        paddingHorizontal: 6,
    }
});