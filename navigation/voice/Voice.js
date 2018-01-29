import React from 'react';
import Sound from 'react-native-sound';
const navSwitchAudio = require('../../navigation/voice/sounds/nav_main.m4a');
const newMessageAudio = require('../../navigation/voice/sounds/nav_main.m4a');
const messageRefreshSuccessAudio = require('../../navigation/voice/sounds/snd_share.m4a');
const messageRefreshSuccessAudio1 = require('../../navigation/voice/sounds/snd_like_comment.m4a');
const messageRefreshSuccessAudio2 = require('../../navigation/voice/sounds/msgr_bball_ball_ready.m4a');
const messageSendBefore = require('../../navigation/voice/sounds/reactions_dock_select_3.m4a');
const messageSendFinish = require('../../navigation/voice/sounds/reactions_dock_select_2.m4a');
import Emitters from '../../constants/Emitters';


export default class Voice extends React.Component{

    componentWillUnmount(){
        this.navSwitchSoundListener.remove();
        this.newMessageSoundListener.remove();
        this.messageRefreshSuccessSoundListener.remove();
    }

    componentWillMount(){
        Sound.setCategory('Ambient', true); // true = mixWithOthers


        this.navSwitchSoundListener = Emitters.DEM.addListener(Emitters.VOICE_NAV_SWITCH,function () {
            const s = new Sound(navSwitchAudio, (e) => {
                if (e) {
                    Log('error', e);
                    return;
                }
                s.play(() => s.release());
            });
        });

        this.newMessageSoundListener = Emitters.DEM.addListener(Emitters.VOICE_NEW_MESSAGE,function () {
            const s = new Sound(newMessageAudio, (e) => {
                if (e) {
                    Log('error', e);
                    return;
                }
                s.play(() => s.release());
            });
        });

        this.messageRefreshSuccessSoundListener = Emitters.DEM.addListener(Emitters.VOICE_MESSAGE_REFRESH_FINISH,function () {
            const s = new Sound(messageRefreshSuccessAudio, (e) => {
                if (e) {
                    Log('error', e);
                    return;
                }
                s.play(() => s.release());
                const s1 = new Sound(messageRefreshSuccessAudio1, (e1) => {
                    if (e1) {
                        Log('error', e1);
                        return;
                    }
                    s1.play(() => s1.release());
                });
            });
        })

        this.messageSendBefore = Emitters.DEM.addListener(Emitters.VOICE_MESSAGE_BEFORE_SEND,function () {
            const s = new Sound(messageSendBefore, (e) => {
                if (e) {
                    Log('error', e);
                    return;
                }
                s.play(() => s.release());
            });
        })

        this.messageSendFinish = Emitters.DEM.addListener(Emitters.VOICE_MESSAGE_FINISH_SEND,function () {
            const s = new Sound(messageSendFinish, (e) => {
                if (e) {
                    Log('error', e);
                    return;
                }
                s.play(() => s.release());
            });
        })
    }

    render(){
        return null
    }
}