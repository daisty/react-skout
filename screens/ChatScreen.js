import React, {Component} from 'react';
import {TouchableHighlight, Button, View, Text, StyleSheet} from 'react-native';

import MessageContainer from '../components/chat/MessageNav';
import Emitters from "../constants/Emitters";

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

function checkTabBarVisible(params) {
    return (params && params.tabBarVisible != null) ? !params.tabBarVisible : true
}

export default class ChatScreen extends Component {

    static navigationOptions = ({navigation}) => ({
        tabBarVisible: checkTabBarVisible(navigation.state.params),
    });

    lastNav = null;

    navigationStateChange = (prevState, newState, action) => {
        let routeName = getCurrentRouteName(newState);
        let visible = 'Messages' === routeName;
        if (this.lastNav === 'MessageChat'&&routeName==='Messages') {
            //是从MessageChat返回Messages
            Emitters.DEM.emit(Emitters.MESSAGE_CHAT_BACKMESSAGES)
        }
        this.lastNav = routeName;
        if (this.props.navigation.params !== visible) {
            this.props.navigation.setParams({
                tabBarVisible: !visible
            });
        }
    };

    render() {
        return (
            <MessageContainer onNavigationStateChange={this.navigationStateChange}/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});