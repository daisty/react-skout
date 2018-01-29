import React from 'react';
import {
    TouchableHighlight,
    SectionList,
    Button,
    TouchableOpacity,
    Modal,
    View,
    Text
} from 'react-native';
import Svg from '../../../icons/Svg';
import Names from '../../../icons/Names'

export default class LanguageList extends React.Component {

    state = {
        defaultChoseLanguage:this.props.defaultChoseLanguage,
        sections: [
            {
                title: '近期使用的语言',
                data: [
                    {
                        id:'zh-cn',
                        name: 'Chinese Simplified',
                        value: '中文(简体)',
                    },
                    {
                        id:'en',
                        name: 'English',
                        value: ''
                    },
                    {
                        id:'auto',
                        name: 'Automatic',
                        value: ''
                    }
                ]
            },
            {
                title: '常用',
                data: [
                    {id:'en',name: 'English', value: ''},
                    {id:'zh-cn',name: 'Chinese Simplified', value: '中文(简体)'},
                    {id:'zh-tw',name: 'Chinese Traditional', value: '中文(繁体)'},
                    {id:'ja',name: 'Japanese', value: ''},
                    {id:'ko',name: 'Korean', value: ''},
                    {id:'es',name: 'Spanish', value: ''},
                    {id:'fr',name: 'French', value: ''},
                    {id:'de',name: 'German', value: ''},
                    {id:'it',name: 'Italian', value: ''},
                    {id:'ru',name: 'Russian', value: ''},
                    {id:'ar',name: 'Arabic', value: ''},
                ]
            }
        ]
    };

    componentWillMount(){
        let dv = this.state.defaultChoseLanguage;
        this.state.sections.forEach(function (i) {
            i.data.forEach(function (j) {
                if(j.id === dv.id){
                    j.select = true;
                }
            });
        });
    }

    renderSectionHeader({section}) {
        return <View
            style={{
                backgroundColor: '#F2F2F2',
                height: 30,
                justifyContent: 'center',
                paddingLeft: 14
            }}
        >
            <Text>{section.title}</Text>
        </View>
    }

    _onPressItem(item) {
        this.props.choseLanguageCallback({
            id:item.id,
            value:item.value,
            name:item.name
        });
        if (item.select) return;
        this.state.sections.forEach(function (i) {
            i.data.forEach(function (j) {
                j.select = undefined;
            });
        });
        item.select = true;
        this.setState({})
    }

    renderItem(self, item) {
        return (
            <TouchableOpacity
                style={{
                    height: 38,
                    justifyContent: 'center'
                }}
                onPress={() => self._onPressItem(item)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 12
                        }}>
                        <Text
                            style={{
                                marginLeft: 4
                            }}
                        >
                            {item.name}
                        </Text>
                    </View>
                    <View
                    >
                        <Text
                            style={{
                                marginLeft: 1
                            }}
                        >
                            {item.value}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                        }}
                    >
                        <Svg display={item.select === undefined ? false : item.select} style={{marginRight: 10}}
                             icon={Names.select} size={14}
                             color={'#9cf'}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    separatorComponent = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '96%',
                    backgroundColor: '#EAEAEB',
                    marginLeft: '4%'
                }}
            >

            </View>
        )
    };

    render() {
        let $self = this;
        return (
            <View>
                <SectionList
                    renderItem={({item}) => this.renderItem($self, item)}
                    ItemSeparatorComponent={this.separatorComponent}
                    keyExtractor={(item, index) => index}
                    renderSectionHeader={this.renderSectionHeader}
                    sections={this.state.sections}
                />
            </View>
        )
    }
}
