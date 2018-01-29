import React from 'react';
import {
    AsyncStorage,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
    ScrollView,
    Text,
    RefreshControl
} from 'react-native';
import Notification from './Notification';
import MessageItem from './MessageItem';
import Emitters from '../../constants/Emitters';
import UserUtils from '../../constants/UserUtils';
import Connect from './Connect';

const forceCache = false;

export default class Messages extends React.Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        // header: null,
        title: '聊天',
        headerRight: <Notification/>,
        headerLeft: <Connect/>
    });

    state = {
        loadMoreRefresh: false,
        refreshing: false,
        chats: {},
        offset: 0,
        firstLoad: true
    }

    //防止快速点击打开多个同一个聊天
    isOpenAChat = false;

    componentWillUnmount() {
        let $self = this;
        $self.deleteConversationListener.remove();
        $self.markAsRead.remove();
        $self.sendMessageSuccess.remove();
        $self.openChatListener.remove();
        $self.onChat.remove();
    }

    componentWillMount() {

        let $self = this;
        $self.renderMessages();

        //返回后设置回没有聊天状态
        $self.messageChatBackToMessages = Emitters.DEM.addListener(Emitters.MESSAGE_CHAT_BACKMESSAGES, function () {
            $self.isOpenAChat = false;
        });

        $self.deleteConversationListener = Emitters.DEM.addListener(Emitters.DELETE_CONVERSATION, function (result) {
            $self.deleteConversation(result.userId);
        });

        $self.markAsRead = Emitters.DEM.addListener(Emitters.MARK_AS_READ, function (result) {
            $self.state.chats.elements.updateAttr('user.id', result.fromId, 'unread_count', 0);
            $self.setState({});
        });
        //发送消息成功,替换聊天列表最后新消息信息
        $self.sendMessageSuccess = Emitters.DEM.addListener(Emitters.SEND_MESSAGE_STATUS, function (result) {
            if (result.status === 'success') {
                let chats = $self.state.chats.elements;
                let obj = null;
                for (let i = 0, len = chats.length; i < len; i++) {
                    obj = chats[i];
                    if (obj.user.id === result.msg.to) { //找到是我发给谁的消息
                        obj['last_message'] = result.msg; //最后一条消息替换
                        //将当前聊天移到首位
                        chats.splice(i, 1);
                        chats.unshift(obj);
                        break;
                    }
                }
                $self.setState({});
                if (obj) {
                    $self.saveCacheChats($self.state.chats);
                } else {
                    Log('用户不在聊天列表了,是不是消息太多了');
                }
            }
        });

        $self.openChatListener = Emitters.DEM.addListener(Emitters.OPEN_CHAT, function (result) {
            $self.props.navigation.navigate('MessageChat', result)
        });

        $self.onChat = Emitters.DEM.addListener(Emitters.SOCKET_CHAT, function (result) {
            Emitters.DEM.emit(Emitters.VOICE_NEW_MESSAGE)
            let msg = JSON.parse(result).args[0];
            let chats = $self.state.chats.elements;
            let obj = null;
            for (let i = 0, len = chats.length; i < len; i++) {
                obj = chats[i];
                if (obj.user.id === msg.from) { //找到是谁发的消息
                    obj['last_message'] = msg; //最后一条消息替换
                    chats.splice(i, 1);
                    chats.unshift(obj);
                    break;
                }
            }
            $self.setState({});
            //在当前显示的聊天列表中,更新缓存
            if (obj) {
                $self.saveCacheChats($self.state.chats);
            } else {
                Log('用户不在聊天列表当中')
            }
        });
    };

    deleteConversation(userId) {
        let $self = this;
        $self.state.chats.elements.updateAttr('user.id', userId, 'del', true, {createNewKey: true});
        $self.setState({}, function () {
            let config = {
                method: 'POST',
                url: URLS.CHAT_DELETE.format({userId}),
                headers: {
                    session_id: SESSION_ID,
                }
            }
            axios(config).then(function (response) {
                //Emitters.DEM.emit(Emitters.MARK_AS_READ,{fromId});
                Log('删除谈话成功');
                $self.state.chats.elements.forEach(function (item, index) {
                    if (item.user.id === userId) {
                        $self.state.chats.elements.splice(index, 1)
                    }
                });
                $self.setState({})
            }).catch(function (err) {
                console.error(err)
            });
        });
    }

    renderMessages(hander) {
        let $self = this;
        $self.setState({refreshing: true});

        if (!hander) {
            $self.readCacheChats(function (err, result) {
                if (result && !forceCache) {
                    let jsonObj = JSON.parse(result);
                    // Log('读取聊天列表缓存', jsonObj);
                    $self.setState({chats: jsonObj, refreshing: false});
                    Emitters.DEM.emit(Emitters.NOTIFICATION_ALL, {
                        count: jsonObj['total_unread'],
                        hasMore: jsonObj['has_more']
                    });
                }
            });
        }
        $self.queryMessages();
    }

    queryMessages() {
        let $self = this;
        let query = function (sessionId) {
            const config = {
                method: 'get',
                url: URLS.CHATS_LISTS.format({limit: 10, offset: 0}),
                headers: { //header
                    session_id: sessionId
                },
                transformResponse: [function (data) {
                    return JSON.parse(data);
                }
                ]
            };
            Log('读取网络聊天列表', config);
            axios(config).then(function (response) {
                Log('读取网络聊天列表完成', response.data);
                // if (hander) {
                //     Emitters.DEM.emit(Emitters.VOICE_MESSAGE_REFRESH_FINISH)
                // }
                $self.saveCacheChats(response.data);
                $self.setState({chats: response.data, firstLoad: false, refreshing: false});
                Emitters.DEM.emit(Emitters.NOTIFICATION_ALL, {
                    count: response.data['total_unread'],
                    hasMore: response.data['has_more']
                });
            }).catch(function (error) {
                Log('读取聊天列表异常', error)
                if (error.response) {
                    if (error.response.status === 403) {
                        //需要重新登录
                        Emitters.DEM.emit(Emitters.AJAX_LOGIN_403)
                    }
                }
            });
        };
        if (global.SESSION_ID === "") {
            UserUtils.readSessionId(function (err, result) {
                if (result) {
                    query(result);
                }
            })
        } else {
            query(SESSION_ID);
        }

    }

    saveCacheChats = async (response) => {
        try {
            await AsyncStorage.setItem('chats', JSON.stringify(response));
        } catch (error) {
            // Error saving data
        }
    };

    readCacheChats = (call) => {
        try {
            AsyncStorage.getItem('chats', call);
        } catch (error) {
            // Error saving data
        }
    };

    itemOnOpen = (data) => {
        if (this.isOpenAChat === false) {
            this.isOpenAChat = true;
        } else {
            Log('请不要点击聊天太快');
            return;
        }
        let fromId = data.user.id;
        let userName = data.user.name;
        let unread_count = data.unread_count;
        let uuid = data.user['image_url'].substring(30);
        let img = URLS.PEOPLE_IMAGE.format({id: uuid, size: "_tn50.jpg"});
        if (img.length === 0) {
            alert('图片地扯为空')
        }
        Emitters.DEM.emit(Emitters.OPEN_CHAT, {fromId, userName, img, unread_count});
    };

    renderItem(data) {
        return <MessageItem itemOnOpen={this.itemOnOpen} key={data.user.id} del={data.del} data={data}/>
    }

    _onRefresh = () => {
        this.renderMessages(true);
    };

    loadMore = (info) => {
        let $self = this;
        Log('session_id',SESSION_ID)
        if (this.state.firstLoad&&!SESSION_ID){
            return;
        }
        $self.setState({
            offset: $self.state.offset + 1,
            loadMoreRefresh: true
        }, function () {
            const config = {
                method: 'GET',
                url: URLS.CHATS_LISTS.format({limit: 10, offset: $self.state.offset}),
                headers: { //header
                    session_id: SESSION_ID
                }
            };
            Log('加载更多聊天列表',config);
            axios(config).then(function (response) {
                $self.state.chats.elements = $self.state.chats.elements.concat(response.data.elements);
                $self.saveCacheChats($self.state.chats);
                $self.setState({loadMoreRefresh: false})
            });
        });

    };

    separatorComponent = () => {
        return (<View style={{
            height: 1,
            width: '96%',
            backgroundColor: '#F4F4F4',
            marginLeft: '4%'
        }}></View>)
    };

    renderFooter = () => {
        return <View>
            {this.state.loadMoreRefresh && <ActivityIndicator animating size="large"/>}
        </View>
    }

    render() {
        let navigation = this.props.navigation;
        return (<FlatList refreshControl={<RefreshControl
            refreshing={
                this.state.refreshing
            }
            onRefresh={
                this._onRefresh
            }
        />} ItemSeparatorComponent={this.separatorComponent} initialNumToRender={10} onEndReachedThreshold={0.2}
                          onEndReached={this.loadMore} renderItem={(data) => this.renderItem(data.item)}
                          data={this.state.chats.elements} keyExtractor={(item, index) => index}
                          ListFooterComponent={this.renderFooter} style={styles.container}></FlatList>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});
