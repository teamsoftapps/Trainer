import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../Components/Wrapper';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../utils/Images';
import Upcoming from './Upcoming';
import Previous from './Previous';

const Search = () => {
  const Tab = createMaterialTopTabNavigator();

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
              style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Search"
            placeholderTextColor={'white'}
            style={{
              fontSize: responsiveScreenFontSize(2.2),
              width: responsiveWidth(52),
              color: 'white',
            }}
          />
        </View>
        <TouchableOpacity activeOpacity={0.6} style={{}}>
          <Text style={{color: 'white'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        tabBar={({navigation, state}) => (
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
                // setselect(false);
                navigation.navigate('Upcoming');
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
                // setselect(false);
                navigation.navigate('Previous');
              }}
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: state.index === 1 ? 2 : 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{color: 'white'}}>People</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2.1),
              }}>
              <Text style={{color: 'white'}}>Suggestion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 0.25,
                borderBottomColor: '#9FED3A',
                borderBottomWidth: 0,
                alignItems: 'center',
                paddingVertical: responsiveHeight(2),
              }}>
              <Text style={{color: 'white'}}>Places</Text>
            </TouchableOpacity>
          </View>
        )}>
        <Tab.Screen name="Upcoming" component={Upcoming} />
        <Tab.Screen name="Previous" component={Previous} />
      </Tab.Navigator>
    </WrapperContainer>
  );
};

export default Search;

const styles = StyleSheet.create({});
