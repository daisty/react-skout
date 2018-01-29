import React from 'react';
import {AsyncStorage} from 'react-native';

const SOCKET_ID = "socketId";
const TIMEOUT_SECONDS = 90;
const isDevelop = true;

export default class SocketUtils extends React.Component {

    static socketIsTimeouted(call) {
        AsyncStorage.getItem(SOCKET_ID, function (err, result) {
            if (result) {
                let betweenTime = Math.floor((new Date() - new Date(JSON.parse(result).time)) / 1000);
                if (betweenTime < 90) {
                    call(null, false)
                } else {
                    call(err, true)
                }
            } else if (err) {
                Log(err)
                call(err)
            }else{
                call(null,null)
            }
        });
    }

    static clear(){
        AsyncStorage.removeItem(SOCKET_ID);
    }

    static readSocketId(call) {
        try {
            AsyncStorage.getItem(SOCKET_ID, function (err, result) {
                Log('socketId',result);
                if (err) {
                    call(err)
                } else {
                    call(null, JSON.parse(result).socketId)
                }
            });
        } catch (error) {
            console.log(error);
            call(error);
        }
    }

    static saveSocketId(socketId, call) {
        try {
            AsyncStorage.setItem(SOCKET_ID, JSON.stringify({
                socketId,
                time: new Date()
            }));
        } catch (error) {
            console.log(error);
            if (call)
                call(error);
        }
    }

    static updateSocketId(socketId, call) {
        try {
            AsyncStorage.setItem(SOCKET_ID, JSON.stringify({
                socketId,
                time: new Date().getTime()
            }));

        } catch (error) {
            console.log(error);
            if (call)
                call(error);
        }
    }

}