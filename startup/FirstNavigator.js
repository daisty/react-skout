import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    findNodeHandle,
    TextInput,
    Image,
    ImageBackground,
    StyleSheet
} from 'react-native';
import {BlurView, VibrancyView} from 'react-native-blur';
import Svg from '../icons/Svg';
import Names from '../icons/Names';

export default class FirstNavigator extends React.Component {

    static navigationOptions = {
        header: null,
        title: '启动入口'
    };

    constructor(props) {
        super(props);
        this.state = {viewRef: null};
    }

    imageLoaded() {
        this.setState({viewRef: findNodeHandle(this.backgroundImage)});
    }

    login = () => {
        this.props.navigation.navigate('Login');
    };


    render() {

        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <ImageBackground source={require('../img/banner.jpg')} style={styles.absolute}>
                    <VibrancyView blurType="dark" style={styles.flex}/>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                        }}>
                        <Image
                            source={require('../img/logo.png')}
                        />
                        <Text
                            style={{
                                color: '#FFF'
                            }}
                        >Suport by dounine</Text>
                    </View>
                    <View>
                        <View
                            style={{
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0)'
                            }}>
                            <View>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        marginBottom: 4,
                                    }}
                                >Welcome</Text>
                            </View>

                            <View
                                style={{
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontSize: 16,
                                        textAlign: 'center'
                                    }}
                                >
                                    Skout is the world's best place to meet and discover new people!
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: 20,
                                marginVertical: 4
                            }}>
                            <TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#FFF',
                                        borderRadius: 2,
                                        padding: 10,
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View>
                                        <Svg icon={Names.facebook} size={20}/>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#555555'
                                            }}
                                        >Login with Facebook</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginVertical: 4
                            }}>
                            <TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#FFF',
                                        borderRadius: 2,
                                        padding: 10,
                                        marginHorizontal: 12
                                    }}
                                >
                                    <View>
                                        <Svg icon={Names.google} size={20}/>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#555555'
                                            }}
                                        >Login with Google</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 12,
                                marginTop: 6,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderWidth: 1,
                                    borderColor: '#F2F2F2',
                                    height: 38,
                                    marginRight: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#F2F2F2'
                                    }}
                                >Sign Up</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.login}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderWidth: 1,
                                    borderColor: '#F2F2F2',
                                    height: 38,
                                    marginLeft: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 2
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            color: '#F2F2F2'
                                        }}
                                    >Login</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View
                            style={{
                                marginHorizontal: 20,
                                marginTop: 6,
                                marginBottom: 10
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFF',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    textAlign: 'center'
                                }}
                            >
                                By signing in,you are agreeing to our&nbsp;
                                <Text
                                    style={{
                                        textDecorationLine: 'underline',
                                        textDecorationColor: '#FFF',
                                    }}
                                >Terms of Service</Text>

                                &nbsp;
                                and
                                &nbsp;
                                <Text
                                    style={{
                                        textDecorationLine: 'underline',
                                        textDecorationColor: '#FFF',
                                    }}
                                >Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    </View>

                </ImageBackground>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    flex: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});