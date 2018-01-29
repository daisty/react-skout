import React from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';
import Emitters from '../../constants/Emitters';
import Svg from "../../icons/Svg";

export default class Connect extends React.Component {

    state = {
        connect: null,
        text: '连接中..',
        error: false
    };

    componentWillMount() {
        let $self = this;
        this.socketConnectStatus = Emitters.DEM.addListener(Emitters.SOCKET_CONNECT_STATUS, function (status) {
            if (status === 'connecting') {
                $self.setState({
                    connect: true,
                    text: '连接中...'
                });
            } else if (status === 'success') {
                $self.setState({
                    text: '连接成功',
                    connect: false
                });
            }
        });
        this.socketLoginLoading = Emitters.DEM.addListener(Emitters.SOCKET_LOGIN_LOADING, function () {
            $self.setState({
                connect: true,
                text: '登录中...'
            });
        });
        this.socketLoginSuccess = Emitters.DEM.addListener(Emitters.SOCKET_LOGIN_SUCCESS, function () {
            $self.setState({
                text: '登录成功'
            });
            setTimeout(function () {
                $self.setState({
                    connect: false,
                });
            }, 500);
        });
        this.socketLoginFailed = Emitters.DEM.addListener(Emitters.SOCKET_LOGIN_FAILED, function () {
            $self.setState({
                text: '登录失败',
                error: true
            });
        });
    }

    componentWillUnmount() {
        this.socketConnectStatus.remove();
        this.socketLoginSuccess.remove();
        this.socketLoginFailed.remove();
    }

    getRender() {
        let statusIcon = <ActivityIndicator
            animating={true}
            style={styles.connectIcon}
            size="small"/>;
        if (this.state.connect === true) {
            if (this.state.error === true) {
                statusIcon = <Svg icon="login-failed" size="20" color="#656565" style={{marginLeft: 10}}/>
            }
        }

        if (this.state.connect) {
            return <View style={styles.container}>
                {statusIcon}
                <Text
                    style={styles.connectText}
                >{this.state.text}</Text>
            </View>
        }
    }

    render() {
        return (
            <View

            >
                {
                    this.getRender()
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    connectIcon: {
        marginLeft: 10
    },
    connectText: {
        fontSize: 12,
        marginLeft: 4
    }
});
