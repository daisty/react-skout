import React from 'react';
import {TouchableHighlight,SectionList,Button,TouchableOpacity,Modal,View,Text} from 'react-native';
import LanguageList from './LanguageList';
import Svg from '../../../icons/svgs';
import Names from '../../../icons/Names'

export default class Language extends React.Component{

    state = {
        modalVisible:this.props.choseLanguageShow,
        defaultChoseLanguage:this.props.defaultChoseLanguage
    };

    onPressChanel=()=>{
        this.setState({
            modalVisible:false
        })
    };

    componentWillReceiveProps=(props)=>{
        if(props.choseLanguageShow){
            this.setState({
                defaultChoseLanguage:props.defaultChoseLanguage,
                modalVisible:true
            })
        }else{
            this.setState({
                modalVisible:false
            })
        }
    };

    render(){
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
            >
                <View style={{marginTop: 22}}>
                    <View
                        style={{
                            height:30,
                            justifyContent:'center',
                            marginLeft:14
                        }}
                    >
                        <TouchableOpacity
                            onPress={this.onPressChanel}
                        >
                            <Text
                            style={{color:'#425FD0'}}
                            >取消</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <LanguageList choseLanguageCallback={this.props.choseLanguageCallback} defaultChoseLanguage={this.state.defaultChoseLanguage}/>
                    </View>
                </View>
            </Modal>
        )
    }
}