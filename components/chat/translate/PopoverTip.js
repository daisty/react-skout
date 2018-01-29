import React from 'react';
import {Clipboard,TouchableOpacity, View, Text} from 'react-native';

export default class PopoverTip extends React.Component {

    state = {
        popoverTipObj:this.props.popoverTipObj
    };


    translate = () => {
        this.props.popoverClickCallback('translate',{
            id:this.props.popoverTipObj.id,
            result:this.props.popoverTipObj.result
        });
    };

    speak = () => {
        this.props.popoverClickCallback('speak');
    };

    copy = () => {
        this.props.popoverClickCallback('copy');
        Clipboard.setString(this.state.popoverTipObj.text)
    };

    render() {

        return (
            <View
                style={{
                    flexDirection: 'row',
                    borderRadius:10,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding:8,
                }}>
                <View
                    style={{
                        position:'absolute',
                        left:this.props.left-6,
                        top:38.4,
                        width: 0,
                        height: 0,
                        borderLeftWidth: 6,
                        borderLeftColor:'transparent',
                        borderRightWidth: 6,
                        borderRightColor:'transparent',
                        borderTopWidth: 10,
                        borderTopColor: 'rgba(0,0,0,0.7)',
                    }}
                >

                </View>
                <View
                    style={{
                        margin: 4,
                        paddingRight: 8,
                        borderRightColor: '#2A2A2A',
                        borderRightWidth: 1,
                    }}
                >
                    <TouchableOpacity
                        onPress={this.copy}
                    >
                        <View>
                            <Text
                                style={{
                                    color: '#FFF'
                                }}
                            >复制</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        margin: 4,
                        paddingRight: 8,
                        borderRightColor: '#2A2A2A',
                        borderRightWidth: 1,
                    }}
                >
                    <TouchableOpacity
                        onPress={this.speak}
                    >
                        <View>
                            <Text
                                style={{
                                    color: '#FFF'
                                }}
                            >朗读</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        margin: 4,
                    }}
                >
                    <TouchableOpacity
                        onPress={this.translate}
                    >
                        <View>
                            <Text
                                style={{
                                    color: '#FFF'
                                }}
                            >翻译</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}