import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import Svg from '../../../icons/Svg';
import Style from './Styles';
import Emitters from "../../../constants/Emitters";
import TranslateLoading from './TranslateLoading';


export default class They extends React.Component {

    state = {
        showTranslate: false,
        translateResult: this.props.translateResult,//翻译结果
        translateLoading: false//是否翻译中
    };

    firstLoad = true;


    componentWillReceiveProps(props) {
        if (this.firstLoad) {
            this.firstLoad = false;
            return;
        }
        Log('接收更改翻译值', props);
        if (props.translateResult && props.translateResult.length > 0) {//翻译完成,显示翻译结果
            this.setState({
                translateLoading: props.translateLoading,
                translateResult: props.translateResult
            });

        }

    }


    clickText = (target) => {
        let $self = this;
        this.myRef.measure(function (x, y, width, height, pageX, pageY) {
                Emitters.DEM.emit(Emitters.TRANSLATE_POPOVER, {
                    text: $self.props.text,
                    id: $self.props.id,
                    y,
                    width,
                    height,
                    pageX,
                    pageY
                })
            }
        )
    };

    toggleTranslate = () => {
        if (this.state.translateResult) {
            this.setState({
                showTranslate: !this.state.showTranslate
            })
        }
    };

    render() {
        let $self = this;
        return (
            <View
                style={styles.theyAreBoxView}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}
                >
                    <View
                        style={styles.theyAreHandView}>
                        <Image
                            source={{
                                url: this.props.img
                            }}
                            style={styles.theyAreHandImage}
                        ></Image>
                    </View>
                    <View style={styles.theyAreMsgView}>
                        <View style={styles.theyAreMsgContentView}>
                            <View
                                style={{flex: 1, flexDirection: 'row'}}
                            >

                                <TouchableOpacity
                                    onPress={this.clickText}
                                    ref={ref => this.myRef = ref}
                                >
                                    <View>
                                        <Text
                                            style={styles.theyAreMsgContent}
                                        >
                                            {this.props.text.emojiReplace()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                            {
                                this.state.showTranslate && this.state.translateResult &&
                                <View>
                                    <View
                                        style={styles.translateViewDivide}
                                    >
                                    </View>
                                    <View style={styles.translateView}>
                                        <Text style={styles.translateViewText}>
                                            {this.state.translateResult[0].value}
                                        </Text>
                                    </View>
                                </View>

                            }


                        </View>


                        {
                            this.state.translateResult &&
                            <View
                                style={styles.theyAreMsgIconView}
                            >
                                <TouchableOpacity
                                    onPress={this.toggleTranslate}
                                >
                                    <View>
                                        {
                                            this.state.showTranslate &&
                                            <Svg icon="translate-left-down" size="16" style={styles.coverIcon}/>
                                        }
                                        {
                                            !this.state.showTranslate &&
                                            <Svg icon="translate-left-up" size="16" style={styles.coverIcon}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
                {
                    this.state.translateLoading &&
                    <TranslateLoading />
                }
            </View>)
    }
}

const styles = Style.clone();
styles.content = {
    padding: 8,
    backgroundColor: '#353535',
    borderRadius: 4,
};
styles.arrow = {
    borderTopColor: '#353535',
};
styles.background = {
    backgroundColor: 'rgba(0, 0, 255, 0)'
};