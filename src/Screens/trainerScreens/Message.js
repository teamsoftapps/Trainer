import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import {Images} from '../../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  useCreateMessaegMutation,
  useGetMessagesQuery,
} from '../../store/Apis/messages';
import {useSelector} from 'react-redux';
import useToast from '../../Hooks/Toast';
import {socketService} from '../../utils/socketService';

const limit = 8;

const Message = ({route, navigation}) => {
  const userData = useSelector(state => state.Auth.data);
  const data = route.params;

  const [createMessaeg] = useCreateMessaegMutation();
  const [messages, setMessages] = useState([]);
  const [page, setpage] = useState(1);
  const {showToast} = useToast();

  const body = {
    chatId: data?.id,
    limit,
    page,
  };

  const {data: getMessages, isError} = useGetMessagesQuery(body);

  useEffect(() => {
    if (getMessages?.data) {
      setMessages(getMessages.data);
    }

    if (isError) {
      showToast('Error', isError, 'danger');
    }
  }, [getMessages, isError]);

  useEffect(() => {
    socketService.emit('join_room', data?.id);

    socketService.on('Send_Message', socketData => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, socketData.data),
      );
    });

    return () => {
      socketService.removeListener('Send_Message');
    };
  }, []);

  const onSend = useCallback(async (msgs = []) => {
    const payload = {
      chatId: data?.id,
      text: msgs[0]?.text,
    };

    try {
      const res = await createMessaeg(payload);

      if (res?.data) {
        socketService.emit('Send_Message', res.data);
      } else {
        showToast('Error', res?.error?.data?.message, 'danger');
      }
    } catch (error) {
      console.log('Error', error);
    }
  }, []);

  return (
    <WrapperContainer>
      <View style={styles.top}>
        <View style={styles.left_container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Images.back} tintColor="white" style={styles.back} />
          </TouchableOpacity>

          <Image source={{uri: data?.profile}} style={styles.profile_image} />

          <Text style={styles.user}>{data?.name}</Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          onSend={msgs => onSend(msgs)}
          user={{
            _id: userData?.data._id,
          }}
        />
      </View>
    </WrapperContainer>
  );
};

export default Message;

const styles = StyleSheet.create({
  user: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '300',
    color: 'white',
  },
  profile_image: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(3),
  },
  back: {
    width: responsiveWidth(6),
    height: responsiveHeight(2.8),
    resizeMode: 'contain',
  },
  top: {
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
