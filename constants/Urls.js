import './Properties'
export default {
    //webscoket连接地扯
    SOCKET_WSS: "wss://www.skout.com/realtime/${randomNumber}/${randomString}/websocket",
    //删除聊天谈话
    CHAT_DELETE:"http://dounine.com:3334/api/1/chats/${userId}/delete",
    //查看聊天列表
    CHATS_LISTS:"http://dounine.com:3334/api/1/chats?limit=${limit}&offset=${offset}",
    //查看聊天消息
    CHAT_MESSAGE_LISTS:"http://dounine.com:3334/api/1/chats/${userId}?_ignoreLoadingBar=true&limit=${limit}&offset=${offset}",
    //发送聊天消息
    CHAT_SEND_MESSAGE:"http://dounine.com:3334/api/1/chats/${userId}/send",
    //阅读消息
    CHAT_MARK_AS_READ:"http://dounine.com:3334/api/1/chats/${userId}/mark-as-read",
    //查看聊天头像
    PEOPLE_IMAGE:"http://dounine.com:3333/skout-image?id=${id}&size=${size}",
    //翻译接口
    TRANSLATE:"http://dounine.com:3333/translate",
    //IOS发送消息
    IOS_SEND_MESSAGE:"http://dounine.com:3335/api/1/chats/${userId}/send",
    //IOS查看聊天列表
    IOS_CHATS:"http://dounine.com:3335/api/1/chats?api_version=52&application_code=7REWTEKA7WB49VR6ESIW&limit=13&message_version=500&rand_token=1830729282&since_message=${since_message}",
    //IOS查看聊天请求
    IOS_CHAT_REQUESTS:"http://dounine.com:3335/api/1/chats/requests?since_message=${since_message}&rand_token=${rand_token}&application_code=${application_code}&limit=${limit}",
    //IOS聊天最新聊天排序列表
    IOS_GET_NEW_MESSAGES:"http://dounine.com:3335/api/1/chats/get_new_messages?application_code=${application_code}&rand_token=${rand_token}",
    //查看某人是否有消息发送给我[有bug,结果一直是true]
    IOS_HAS_SENT_MESSAGE_TO_ME:"http://dounine.com:3335/api/1/chats/${userId}/has_sent_message_to_me",
    //消息阅读
    IOS_MARK_AS_READ:"http://dounine.com:3335/api/1/chats/${userId}/mark-as-read",
    //查看聊天消息列表
    IOS_CHATS_FOR_NEWS:"GET http://dounine.com:3335/api/1/chats/${userId}?application_code=7REWTEKA7WB49VR6ESIW&cursor_type=message&limit=10&message_version=500&rand_token=1602357524",
    //查看用户信息
    IOS_USER_INFO:"http://dounine.com:3335/api/1/users/${userId}",
    //发送正在输入中状态,让对方知道
    IOS_SEND_TYPING:"http://dounine.com:3335/api/1/chats/${userId}/send/typing",
    //重置聊天超时时间
    IOS_RESET_CHAT_TIMEOUT:"http://ios.skoutapis.com/api/1/push/reset_chat_timeout",
    //查看个人信息
    IOS_ME_INFO:"http://dounine.com:3335/api/1/me?rand_token=1663944749&application_code=7REWTEKA7WB49VR6ESIW",
    //登录
    IOS_LOGIN:"https://i.skoutapis.com/services/ServerService/GCLoginUserSignedNewUDID"

}
