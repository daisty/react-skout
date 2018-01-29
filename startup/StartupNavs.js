import React from 'react';
import {View} from 'react-native';
import {StackNavigator} from 'react-navigation';
import FirstNavigator from './FirstNavigator';
import LoginScreens from '../login/LoginScreens';
import CaptchaScreens from '../login/CaptchaScreens';

export default StackNavigator({
        First: {
            screen: FirstNavigator
        },
        Login: {
            screen: LoginScreens
        },
        Captcha: {
            screen: CaptchaScreens
        }
    }, {
        initialRouteName: 'First',
    }
)

