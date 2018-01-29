import React from 'react';
import {
  ActivityIndicator,
  TouchableHighlight,
  StyleSheet,
  ImageBackground,
  View,
  Text,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import Svg from '../../icons/Svg';
import Layout from '../../constants/Layout';
import Emitters from '../../constants/Emitters';
import TimeUtils from '../../constants/TimeUtils';
import {CachedImage} from "react-native-img-cache";

class DelComponent extends React.Component {

  render() {
    return (<View style={styles.deleteIconBox}>
      <ActivityIndicator animating={true} color="#FFFFFF" style={styles.deleteIcon} size="small"/>
    </View>)
  }
}

export default class MessageItem extends React.Component {

  state = {
    deling: this.props.del
  };

  onDelete = () => {
    const {data} = this.props;
    Emitters.DEM.emit(Emitters.DELETE_CONVERSATION, {userId: data.user.id});
  };

  componentWillReceiveProps(props) {
    if (props.del !== undefined) {
      this.setState({deling: true})
    }
  }

  getDelComponent() {
    return (<View style={styles.deleteIconBox}>
      {
        this.state.deling === undefined
          ? <Text style={{
                color: '#FFF'
              }}>删除</Text>
          : <ActivityIndicator animating={true} color="#FFFFFF" style={styles.deleteIcon} size="small"/>
      }
    </View>)
  }

  render() {

    const {data} = this.props;
    let uuid = data.user['image_url'].substring(30);
    let img = URLS.PEOPLE_IMAGE.format({id: uuid, size: '_tn50.jpg'});
    return (<View>
      <Swipeout style={{
          backgroundColor: '#FFFFFF'
        }} right={[{
            component: this.getDelComponent(),
            type: 'delete',
            onPress: this.onDelete
          }
        ]}>
        <TouchableHighlight underlayColor={'#000000'} onPress={() => this.props.itemOnOpen(data)}>
          <View style={styles.messageListBox}>
            <View style={styles.messageListDivide}/>
            <View style={styles.messageList}>
              <View>
                <View>
                  <CachedImage
                    source={{
                      uri: img,
                    }} style={styles.messageHeader}/>

                  {data.user.online && <Svg icon="point" size="18" style={styles.online}></Svg>}

                </View>
              </View>
              <View style={styles.usernameAndMessage}>
                <View>
                  <Text style={styles.usernameText}>{data.user.name.symbolReturnClear()}</Text>
                </View>
                <View>
                  <Text numberOfLines={1} style={styles.messageText}>{data.last_message.text.symbolReturnClear().emojiReplace()}</Text>
                </View>
              </View>
              <View>
                <View style={styles.messageTimeBox}>
                  <Text style={styles.messageTime}>{TimeUtils(data.last_message.dt)}</Text>
                </View>
                <View style={[
                    styles.messageCountBox, {
                      backgroundColor: data.unread_count > 0
                        ? 'red'
                        : '#FFF'
                    }
                  ]}>
                  <Text style={styles.messageCountText}>{data.unread_count || ''}</Text>
                </View>
              </View>
            </View>

          </View>
        </TouchableHighlight>
      </Swipeout>
    </View>)
  }
}

const styles = StyleSheet.create({
  messageListBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF'
  },
  messageListDivide: {
    width: 14
  },
  messageList: {
    backgroundColor: '#FFFFFF',
    height: 70,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  messageHeader: {
    // marginLeft: 14,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden'
  },
  online: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: -2,
    top: -2
  },
  usernameAndMessage: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column'
  },
  usernameText: {
    height: 26,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  messageText: {
    color: '#A8A8A8',
    marginRight: 6
  },
  messageTime: {
    marginRight: 10,
    color: '#B5B5B5'
  },
  messageTimeBox: {
    marginBottom: 12
  },
  messageCountBox: {
    width: 20,
    height: 20,
    marginRight: 18,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  messageCountText: {
    color: '#FFF',
    fontSize: 12,
    // alignItems:'center'
  },
  deleteIconBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteIcon: {}
});
