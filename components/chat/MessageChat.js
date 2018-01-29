import React from 'react';
import {StackNavigator} from 'react-navigation';
import {
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Easing
} from 'react-native';
import Svg from '../../icons/Svg';
import TheyMsg from './msg/They';
import MineMsg from './msg/Mine';
import TimeDivide from './msg/ChatTimeDivide';
import ChatSettings from './profile/Settings';
import ChatInput from './input/ChatInput';
import Emitters from '../../constants/Emitters';
import UserUtils from '../../constants/UserUtils';
import PopoverTip from './translate/PopoverTip';

const ITEM_HEIGHT = 54;
const myId = '126709797';

export default class MessageChat extends React.Component {

  static navigationOptions = ({navigation, screenProps}) => ({headerTitle: navigation.state.params.userName, headerRight: (<ChatSettings navigation={navigation}/>)});

  constructor() {
    super();
    this.state = {
      refreshing: true,
      messages: {},
      offset: 0,
      translatePopverLayout: false,
      popoverTipObj: {},
      translateY: 0,
      translateX: 0
    };
  }

  componentWillUnmount() {
    this.switchTranslate.remove();
    this.sendMessageListener.remove();
    this.translatePopver.remove();
  }

  componentWillMount() {
    let $self = this;
    //显示聊天列表
    $self.searchChatList();
    $self.switchTranslate = Emitters.DEM.addListener(Emitters.SWITCH_TRANSLATE, function(result) {
      $self.props.navigation.navigate('Translate')
    });
    $self.sendMessageListener = Emitters.DEM.addListener(Emitters.SEND_MESSAGE, function(result) {
      $self.sendMessage(result);
    });
    $self.translatePopver = Emitters.DEM.addListener(Emitters.TRANSLATE_POPOVER, function(result) {
      let popoverHeightAndMargin = 120;
      let popoverWidth = 60;
      let translateY = result.pageY - popoverHeightAndMargin;
      let translateX = result.pageX + (result.width / 2) - popoverWidth;
      translateX = translateX < 20
        ? 20
        : translateX;
      $self.setState({
        translatePopverLayout: true,
        translateY,
        translateX,
        popoverBottomX: result.pageX + (result.width / 2) - translateX,
        popoverTipObj: {
          id: result.id,
          text: result.text
        }
      })
    })
  };

  popoverClickCallback = (type, res) => {
    let $self = this;
    let mes = $self.state.messages;
    if (type === 'translate') {
      let config = {
        method: 'post',
        url: URLS.TRANSLATE,
        data: FORM_URLENCODED({resourceLanguage: 'en', targetLanguage: 'zh-cn', translateResource: $self.state.popoverTipObj.text})
      };
      axios(config).then(function(response) {
        mes.elements.updateAttr('id', res.id, 'translateLoading', false, {createNewKey: true}); //关掉翻译中进度条
        $self.setState({}, function() {
          $self.translateShowResult({id: $self.state.popoverTipObj.id, results: response.data});
        });
        Log(response.data)
      }).catch(function(error) {
        Log('翻译失败', error)
        mes.elements.updateAttr('id', res.id, 'translateLoading', false, {createNewKey: true});
        $self.setState({});
      })
    }
    mes.elements.updateAttr('id', res.id, 'translateLoading', true, {createNewKey: true});
    this.setState({translatePopverLayout: false});
  };

  //popoverTip点击翻译结果回调
  translateShowResult = (res) => {
    Log('翻译成功', res)
    let mes = this.state.messages;
    mes.elements.updateAttr('id', res.id, 'translateResult', res.results, {createNewKey: true});
    this.setState({});
    UserUtils.saveMessage(this.props.navigation.state.params.fromId, this.state.messages);
  }

  sendMessage(context) {
    let fromId = this.props.navigation.state.params.fromId;
    let $self = this;
    let messages = $self.state.messages.elements;
    Emitters.DEM.emit(Emitters.SEND_MESSAGE_STATUS, {status: 'sending'});
    Emitters.DEM.emit(Emitters.VOICE_MESSAGE_BEFORE_SEND);
    let randomId = Math.random().toString();
    let sendMsg = {
      id: randomId,
      text: context.trim(),
      to: fromId,
      from: myId,
      dt: new Date().getTime(),
      sending: true
    };
    messages.unshift(sendMsg);
    $self.setState({});

    let config = {
      method: 'post',
      url: URLS.CHAT_SEND_MESSAGE.format({userId: fromId}),
      headers: {
        'session_id': SESSION_ID
      },
      data: {
        message: context
      }
    };
    axios(config).then(function(response) {
      let _sendMsg = {
        id: response.data.message_id,
        text: context.trim(),
        type: 'message.type.text',
        to: parseInt(fromId),
        from: parseInt(myId),
        dt: response.data.time_sent,
        sending: false
      };
      Emitters.DEM.emit(Emitters.SEND_MESSAGE_STATUS, {
        status: 'success',
        msg: _sendMsg
      });
      Emitters.DEM.emit(Emitters.VOICE_MESSAGE_FINISH_SEND);
      messages.forEach(function(item) {
        if (`${item.id}` === `${randomId}`) {
          item.id = response.data.message_id;
          item.sending = false;
        }
      });
      //保存发送的消息到缓存到,方便下次打开聊天显示
      UserUtils.saveMessage(fromId, $self.state.messages);
      $self.setState({});
    }).catch(function(err) {
      Emitters.DEM.emit(Emitters.SEND_MESSAGE_STATUS, {
        status: 'err',
        msg: err.response.data
      });
    });
  }

  //消息阅读
  markAsRead() {
    let fromId = this.props.navigation.state.params.fromId;
    let unread_count = this.props.navigation.state.params.unread_count;
    if (unread_count === 0)
      return;
    let config = {
      method: 'post',
      url: URLS.CHAT_MARK_AS_READ.format({userId: fromId}),
      headers: {
        session_id: SESSION_ID
      },
      transformResponse: transformResponseText
    };
    Log('阅读消息', config)
    axios(config).then(function() {
      Log('消息已读成功');
      Emitters.DEM.emit(Emitters.MARK_AS_READ, {fromId});
    }).catch(function(err) {
      if (err.response.status === 401) {
        Log('消息已经阅读过了', err)
      }
    });
  }

  searchChatList() {
    let $self = this;
    let fromId = this.props.navigation.state.params.fromId;
    let before = new Date().getTime();

    $self.setState({refreshing: true});

    UserUtils.readMessage(fromId, function(err, cacheMessages) {

      if (cacheMessages) { //读取缓存
        let messages = JSON.parse(cacheMessages);
        $self.setState({refreshing: false, messages: messages});
      }

      //异常检测数据是否同步
      let config = {
        url: URLS.CHAT_MESSAGE_LISTS.format({
          userId:fromId,
          limit:20,
          offset:0
        }),
        headers: { //header
          'session_id': SESSION_ID
        }
      };
      if (!SESSION_ID)
        return;
      axios(config).then(function(response) {
        //消息阅读
        $self.markAsRead();
        //检测本地数据与线上是否一致
        if (cacheMessages) {
          let checkEquals = 0;
          let jsonMessages = JSON.parse(cacheMessages);
          for (let i = 0, len = jsonMessages.elements.length; i < len; i++) {
            let io = jsonMessages.elements[i];
            for (let j = 0, l = response.data.elements.length; j < l; j++) {
              let jo = response.data.elements[j];
              if (jo.id === io.id) {
                checkEquals++;
                break;
              }
            }
          }
          if (response.data.elements.length !== checkEquals) { //数据不一致,刷新缓存
            response.data.elements.reverse();
            UserUtils.saveMessage(fromId, response.data);
            $self.setState({refreshing: false, messages: response.data});
          }
          // Log('数据比较', jsonMessages.elements.length, checkEquals);
          // ----------
        } else {
          response.data.elements.reverse();
          UserUtils.saveMessage(fromId, response.data);
          $self.setState({refreshing: false, messages: response.data});
        }
      }).catch(function(err) {
        console.error(err)
      });
    });
  }

  _onLoadMoreData = (distanceFromEnd) => {};

  renderItem = (item) => {
    const fromId = this.props.navigation.state.params.fromId;
    let data = item.item;
    return <View>
      {
        `${data.to}` === `${myId}`
          ? <TheyMsg img={this.props.navigation.state.params.img} id={data.id} translateResult={data.translateResult} translateLoading={data.translateLoading} text={data.text}/>
          : <MineMsg sending={data.sending} text={data.text}/>

      }
    </View>
  }

  render() {
    const fromId = this.props.navigation.state.params.fromId;
    return (<View style={{
        flex: 1,
        backgroundColor: '#F7F7FB'
      }}>
      <View style={{
          flex: 1,
          paddingBottom: 10
        }}>
        <FlatList inverted="inverted" renderItem={this.renderItem} data={this.state.messages.elements} onEndReachedThreshold={0.2} onEndReached={this._onLoadMoreData} keyExtractor={(item, index) => index} ItemSeparatorComponent={() => <View style={{
              width: '100%',
              backgroundColor: '#F4F4F4',
              height: 8
            }}></View>}></FlatList>
        {
          this.state.translatePopverLayout && <TouchableOpacity onPress={() => this.setState({translatePopverLayout: false})} style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent'
              }}>
              <View/>
            </TouchableOpacity>
        }

        <View ref={"refTranslatePopover"} style={{
            position: 'absolute',
            left: this.state.translateX,
            top: this.state.translateY
          }}>
          {this.state.translatePopverLayout && <PopoverTip popoverClickCallback={this.popoverClickCallback} popoverTipObj={this.state.popoverTipObj} left={this.state.popoverBottomX}/>}
        </View>

      </View>
      <View>
        <ChatInput/>
      </View>
    </View>)
  }
}

const styles = StyleSheet.create({progressView: {}})
