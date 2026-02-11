import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Message = () => {
  const [text, setText] = useState('');

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Could you help me lose this terrible weight quickly and without excessive pain',
      sender: 'me',
      time: '10:11 AM',
    },
    {
      id: '2',
      text: 'Sure!',
      sender: 'other',
      time: '11:25 AM',
    },
    {
      id: '3',
      text: 'I really want to help you anytime',
      sender: 'other',
      time: '11:25 AM',
    },
    {
      id: '4',
      text: 'Thank you in advance',
      sender: 'me',
      time: '11:35 AM',
    },
    {
      id: '5',
      text: 'I was very worried about my condition because it can hamper my daily performance',
      sender: 'me',
      time: '11:35 AM',
    },
    {
      id: '6',
      text: "Ok it's very easy",
      sender: 'other',
      time: '11:42 AM',
    },
  ]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, newMsg]);
    setText('');
  };

  const renderItem = ({item}) => {
    const isMe = item.sender === 'me';

    return (
      <View
        style={[
          styles.messageRow,
          {justifyContent: isMe ? 'flex-end' : 'flex-start'},
        ]}>
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, {color: isMe ? '#000' : '#000'}]}>
            {item.text}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#fff" />

        <Image
          source={{uri: 'https://i.pravatar.cc/150?img=12'}}
          style={styles.avatar}
        />

        <View style={{flex: 1}}>
          <Text style={styles.name}>Alex Morgan</Text>
          <Text style={styles.status}>Active now</Text>
        </View>

        <Icon name="videocam" size={24} color="#fff" style={styles.icon} />
        <Icon name="call" size={22} color="#fff" />
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 16}}
      />

      {/* INPUT BAR */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.plusBtn}>
          <Icon name="add" size={26} color="#fff" />
        </TouchableOpacity>

        <TextInput
          placeholder="Type a message"
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Icon name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#121212',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginHorizontal: 10,
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  status: {
    color: '#7CFC00',
    fontSize: 12,
  },

  icon: {
    marginRight: 15,
  },

  messageRow: {
    marginVertical: 6,
    flexDirection: 'row',
  },

  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 14,
  },

  myBubble: {
    backgroundColor: '#57f265',
    borderBottomRightRadius: 2,
  },

  otherBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 2,
  },

  messageText: {
    fontSize: 14,
  },

  timeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 5,
    color: '#666',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#121212',
  },

  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    height: 42,
  },

  sendBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#57f265',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
