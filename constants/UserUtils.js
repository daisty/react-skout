import React from 'react';
import {AsyncStorage} from 'react-native';

const SESSION_ID = "userSessionId";
const sessionId = 'ac1a1105-5c7e-493e-ae9e-1c4236bdcf2c';
const isDevelop = false;

export default class UserUtils extends React.Component {

    static readSessionId(call) {
        try {
            if (isDevelop) {
                call(null,sessionId);
            } else {
                AsyncStorage.getItem(SESSION_ID, call);
            }
        } catch (error) {
            console.log(error);
            call(error);
        }
    }

    static readMessage(userId, call) {
        try {
            AsyncStorage.getItem(userId + '-messages', call);
        } catch (error) {
            console.log(error);
            call(error)
        }
    }

    static saveMessage(userId, messages, call) {
        try {
            let data = (typeof messages === 'object') ? JSON.stringify(messages) : messages
            AsyncStorage.setItem(userId+'-messages', data);
            if (call)
                call(null,'success');
        } catch (error) {
            console.log(error);
            if (call)
                call(error)
        }
    }

    static async saveSessionId(sessionId) {
        try {
            AsyncStorage.setItem(SESSION_ID, sessionId);
        } catch (error) {
            console.log(error)
        }
    }

    static async clearSessionId() {
        try {
            AsyncStorage.removeItem(SESSION_ID);
        } catch (error) {
            console.log(error)
        }
    }

}
