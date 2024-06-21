import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../Components/Wrapper'
import Header from '../Components/Header';
import { responsiveFontSize, responsiveScreenWidth, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Upcoming from './Upcoming';
import Previous from './Previous';
import { useNavigation } from '@react-navigation/native';

const Booking = () => {
  const [first, setfirst] = useState(false)
  return (
    <WrapperContainer style={{ backgroundColor: "#181818" }}>
      <Header/>
      <View>
        <Text style={{ color: "white", fontSize: responsiveFontSize(3.3), marginLeft: responsiveScreenWidth(8) }}>Bookings</Text>
      </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: responsiveWidth(6),
              borderBottomWidth: responsiveHeight(0.05),
              borderBottomColor: 'gray',
            }}>
            <TouchableOpacity
              onPress={() => {
                setfirst(false)
              }}
              activeOpacity={0.8}
              style={{
                borderBottomWidth: responsiveHeight(0.4),
                paddingBottom: responsiveHeight(0.5),
                borderBottomColor:
                 first?"transparent": '#25CC0F',
                borderRadius: responsiveHeight(0.2),
                width: responsiveWidth(50),
                alignItems: 'center'
              }}>
              <Text style={styles.subhead}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setfirst(true)
              }}
              activeOpacity={0.8}
              style={{
                borderBottomWidth: responsiveHeight(0.4),
                paddingBottom: responsiveHeight(0.5),
                borderBottomColor:
                  first?'#25CC0F':"transparent",
                borderRadius: responsiveHeight(0.2),
                width: responsiveWidth(50),
                alignItems: 'center',
              }}>
              <Text style={styles.subhead}>Previous</Text>
            </TouchableOpacity>
          </View>
          <Upcoming/>
    
    </WrapperContainer>
  );
};

export default Booking;

const styles = StyleSheet.create({
  subhead: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
  }
});
