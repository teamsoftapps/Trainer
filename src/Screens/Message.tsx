import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {Images} from '../utils/Images';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainProps} from '../Navigations/MainStack';
import {
  useCreateMessaegMutation,
  useGetMessagesQuery,
} from '../store/Apis/messages';
import {useSelector} from 'react-redux';
import useToast from '../Hooks/Toast';
import {socketService} from '../utils/socketService';

type Props = NativeStackScreenProps<MainProps, 'Message'>;
const limit = 8;
const Message: React.FC<Props> = ({route, navigation}) => {
  const userData = useSelector(state => state.Auth.data);
  // console.log('Userdata', userData?.data._id);
  const data = route.params;
  console.log('DATAAAAAA', data);
  const [createMessaeg] = useCreateMessaegMutation();
  const [messages, setMessages] = useState([]);
  const [page, setpage] = useState(1);
  const {showToast} = useToast();
  let body = {
    chatId: data?.id,
    limit: limit,
    page: page,
  };
  const {data: getMessages, isError, refetch} = useGetMessagesQuery(body);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (getMessages?.data) {
      console.log('Response Data ', getMessages.data);
      setMessages(getMessages.data);
    }
    if (isError) {
      showToast('Error', isError, 'danger');
      console.log('Error Raised', isError);
    }
  }, [getMessages, isError]);

  useEffect(() => {
    socketService.emit('join_room', data?.id);
    socketService.on('Send_Message', (data: any) => {
      console.log('Socket Response From Backend ', data);
      // alert(data);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, data.data)
      );
    });

    return () => {
      socketService.removeListener('Send_Message');
    };
  }, []);

  const onSend = useCallback(async (messages = []) => {
    let payload = {
      chatId: data?.id,
      text: messages[0]?.text,
    };
    try {
      const res: any = await createMessaeg(payload);

      if (res.data) {
        console.log('Dataa', res.data);
        socketService.emit('Send_Message', res.data);
      } else {
        console.log('Data Error', res?.error);
        showToast('Error', res?.error.data.message, 'danger');
      }
    } catch (error) {
      console.log('Error', error);
    }
  }, []);

  return (
    <WrapperContainer>
      <View style={styles.top}>
        <View style={styles.left_container}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={Images.back}
              tintColor={'white'}
              style={styles.back}
            />
          </TouchableOpacity>
          <Image source={{uri: data?.profile}} style={styles.profile_image} />
          <View>
            <Text style={styles.user}>{data?.name}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveWidth(5),
          }}>
          <TouchableOpacity>
            <Image
              source={Images.video_white}
              resizeMode="contain"
              style={{width: responsiveWidth(7), height: responsiveWidth(7)}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={Images.call_white}
              resizeMode="contain"
              style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: userData?.data._id,
          }}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              textInputProps={{
                style: {
                  color: '#000', // Change input text color here
                  paddingLeft: responsiveWidth(2),
                },
              }}
            />
          )}
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
    objectFit: 'cover',
    marginHorizontal: responsiveWidth(3),
  },
  call: {
    borderRadius: responsiveWidth(4),
    height: responsiveWidth(9),
    width: responsiveWidth(9),
  },
  back: {
    width: responsiveWidth(6),
    height: responsiveHeight(2.8),
    resizeMode: 'contain',
  },
  online: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(1),
  },
  online_text: {
    color: '#9FED3A',
    fontSize: responsiveFontSize(1.5),
  },
  dot: {
    backgroundColor: '#9FED3A',
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(4),
  },
  container: {
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  text: {},
  input_container: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    gap: responsiveWidth(5),
    marginHorizontal: 20,
  },
  inp: {
    flex: 1,
    backgroundColor: 'white',
    height: responsiveWidth(12),
    width: responsiveWidth(70),
    borderRadius: responsiveWidth(3),
  },
  message1: {
    backgroundColor: '#4361EE',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 13,
    width: responsiveWidth(40),
  },
  top: {
    height: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    top: 0,
    left: 0,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    backgroundColor: 'white',
    marginLeft: 'auto',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 13,
    width: responsiveWidth(40),
  },
});
