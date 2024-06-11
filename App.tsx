import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MMKV} from 'react-native-mmkv';

const App = () => {
  const data = useSelector(state => state);
  const storage = new MMKV();

  return (
    <View style={{flex: 1}}>
      <Text style={{color: '#000', fontSize: 20, textAlign: 'center'}}>
        App
      </Text>

      <TouchableOpacity style={{}}>
        <Text>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{}}>
        <Text>Get</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
