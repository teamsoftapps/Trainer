import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import WrapperContainer from '../Components/Wrapper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { Images } from '../utils/Images';
import Top from './Top';
import People from './People';
import Suggestion from './Suggestion';
import Places from './Places';
import { useNavigation } from '@react-navigation/native';

const SearchInput = () => {
  const navigation = useNavigation()
  const Tab = createMaterialTopTabNavigator();
  const textInputRef = useRef(null);
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);
  return (
    <WrapperContainer>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: responsiveWidth(8),
          marginTop: responsiveHeight(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#232323',
            paddingHorizontal: responsiveWidth(4),
            borderRadius: 25,
            gap: responsiveWidth(4),
          }}>
          <TouchableOpacity activeOpacity={0.6}>
            <Image
              source={Images.search}
              style={{ width: responsiveWidth(6), height: responsiveWidth(6) }}
            />
          </TouchableOpacity>
          <TextInput
            ref={textInputRef}
            placeholder="Search"
            placeholderTextColor={'white'}
            style={{
              fontSize: responsiveScreenFontSize(2.2),
              width: responsiveWidth(52),
              color: 'white',
            }}
          />
        </View>
        <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.goBack() }}>
          <Text style={{ color: 'white' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        tabBar={({ navigation, state }) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#222222',
              marginVertical: responsiveHeight(2.1),
              borderBottomColor: 'white',
              borderBottomWidth: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Top');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 0 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Top
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('People');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 1 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{ color: 'white' }}>People</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Suggestion');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 2 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{ color: 'white' }}>Suggestion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Places');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 3 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2),
              }}>
              <Text style={{ color: 'white' }}>Places</Text>
            </TouchableOpacity>
          </View>
        )}>
        <Tab.Screen name="Top" component={Top} />
        <Tab.Screen name="People" component={People} />
        <Tab.Screen name="Suggestion" component={Suggestion} />
        <Tab.Screen name="Places" component={Places} />
      </Tab.Navigator>
    </WrapperContainer>
  );
};

export default SearchInput;

const styles = StyleSheet.create({});
